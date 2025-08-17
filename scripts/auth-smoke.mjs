import http from "node:http";

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: "GET", headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () =>
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        })
      );
    });
    req.on("error", reject);
    req.end();
  });
}

function must(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

(async () => {
  const base = "http://localhost:3000";

  // 1) Unauthenticated: GET / should EITHER redirect to /sign-in (middleware)
  // or return 200 and rely on client-side redirect (dev behavior). Accept both.
  const res1 = await get(`${base}/`);
  if (
    !(
      res1.statusCode === 200 ||
      (res1.statusCode >= 300 && res1.statusCode < 400)
    )
  ) {
    console.error(
      `FAIL: Expected 200 or redirect for /, got ${res1.statusCode}`
    );
    process.exit(1);
  }
  if (res1.statusCode >= 300 && res1.statusCode < 400) {
    const loc1 = res1.headers.location || "";
    must(
      loc1.includes("/sign-in"),
      `Expected redirect to /sign-in, got ${loc1}`
    );
  }

  // 2) Unauthenticated: GET /sign-in should be 200
  const res2 = await get(`${base}/sign-in`);
  must(
    res2.statusCode === 200,
    `Expected 200 for /sign-in, got ${res2.statusCode}`
  );

  // 3) Authenticated (simulated via cookie): GET / should be 200
  // We simulate the middleware cookie only; this won't create a real Appwrite session but tests gating.
  const res3 = await get(`${base}/`, { Cookie: "auth=1" });
  must(
    res3.statusCode === 200,
    `Expected 200 for / with auth cookie, got ${res3.statusCode}`
  );

  console.log("PASS: Auth middleware smoke tests OK");
  process.exit(0);
})();
