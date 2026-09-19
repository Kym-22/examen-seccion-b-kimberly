import { NextRequest } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://backend:8080";

type RouteContext = {
  params: {
    path: string[];
  };
};

async function proxyRequest(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  try {
    const path = context.params.path.join("/");
    const currentUrl = new URL(request.url);

    const targetUrl =
      `${BACKEND_URL}/api/${path}${currentUrl.search}`;

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");
    const authorization = request.headers.get("authorization");

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    if (accept) {
      headers.set("Accept", accept);
    }

    if (authorization) {
      headers.set("Authorization", authorization);
    }

    const options: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
      options.body = await request.text();
    }

    const backendResponse = await fetch(targetUrl, options);

    const responseHeaders = new Headers();
    const backendContentType =
      backendResponse.headers.get("content-type");

    if (backendContentType) {
      responseHeaders.set("Content-Type", backendContentType);
    }

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[BFF PROXY ERROR]", error);

    return Response.json(
      {
        success: false,
        message: "No fue posible comunicarse con el backend",
        data: null,
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;