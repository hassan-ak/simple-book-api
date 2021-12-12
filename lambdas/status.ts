export async function handler() {
  try {
    return {
      statusCode: 201,
      body: `{ "Status": "Success" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `{ "Status": "Failure - Try again later" }`,
    };
  }
}
