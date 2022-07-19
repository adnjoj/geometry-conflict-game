type UnauthorizedListener = (response: Response) => any;

export class ApiClient {
  public static readonly SERVER_HOST = `${process.env.SERVER_ORIGIN}:${process.env.SERVER_PORT}`;
  private static _unauthorizedListener: UnauthorizedListener;

  public static get token(): string {
    return localStorage.token;
  }

  public static get unauthorizedListener() {
    return this._unauthorizedListener;
  }

  public static set unauthorizedListener(listener: UnauthorizedListener) {
    this._unauthorizedListener = listener;
  }

  private static fetch(...params: Parameters<typeof fetch>) {
    return fetch(...params).then(async (response) => {
      if (response.status === 401) this.unauthorizedListener?.(response);
      if (response.status === 500) {
        throw new Error('Ошибка на сервере, попробуйте позже');
      }

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.messages?.[0] ?? 'Error');
      }

      return response;
    });
  }

  public static get(url: string, headers?: any) {
    return this.fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: this.token,
        ...headers,
      },
    });
  }

  public static postJson(url: string, body: any, headers?: any) {
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.token,
        ...headers,
      },
    });
  }

  public static postFormData(url: string, body: FormData, headers?: any) {
    return this.fetch(url, {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        Authorization: this.token,
        ...headers,
      },
    });
  }

  public static patchJson(url: string, body: any, headers?: any) {
    return this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.token,
        ...headers,
      },
    });
  }

  public static patchFormData(url: string, body: FormData, headers?: any) {
    return this.fetch(url, {
      method: 'PATCH',
      body,
      headers: {
        Accept: 'application/json',
        Authorization: this.token,
        ...headers,
      },
    });
  }

  public static delete(url: string, body?: FormData, headers?: any) {
    return this.fetch(url, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : '{}',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.token,
        ...headers,
      },
    });
  }
}
