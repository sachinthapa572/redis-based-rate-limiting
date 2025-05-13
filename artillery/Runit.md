## Running Load Tests with Artillery

[Artillery](https://www.artillery.io/) is a modern, powerful, and easy-to-use load testing toolkit. It is used to simulate real-world traffic and measure the performance and scalability of your backend services.

### Why Use Artillery?

- **Performance Testing:** Identify bottlenecks and ensure your application can handle expected traffic.
- **Scalability Assessment:** Test how your system behaves under heavy load.
- **Reliability Verification:** Ensure your services remain stable and responsive.

---

### How to Run a Test Locally

Run the following command to execute your test script locally:

```bash
npx artillery run targetFile.yml
```

---

### Running Tests in the Cloud for Detailed Reports

To generate detailed reports and leverage Artillery's cloud features, use:

```bash
npx artillery run targetFile.yml --record --key <API_KEY>
```

Replace `<API_KEY>` with your actual Artillery API key.

---

For more information, refer to the [Artillery documentation](https://www.artillery.io/docs/).
