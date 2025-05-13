# Project Setup Guide

## Getting Started

### Clone Repository

```bash
git clone https://github.com/sachinthapa572/redis-based-rate-limiting.git
```

### Navigate to Project Directory

```bash
cd <project-name>
```

### Configure Environment

```bash
cp .env.sample .env
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

## Performance Testing with Artillery

[Artillery](https://www.artillery.io/) is an enterprise-grade load testing and performance testing toolkit designed to help development teams build scalable applications.

### Benefits

- **Performance Analysis:** Identify potential bottlenecks and optimize application throughput
- **Scalability Validation:** Evaluate system behavior under various load conditions
- **Reliability Assurance:** Verify stability and response consistency under stress

### Local Test Execution

Execute test scenarios with the following command:

```bash
npx artillery run <test-script>.yml
```

### Cloud-Based Testing with Detailed Analytics

For comprehensive performance reports and metrics:

```bash
npx artillery run <test-script>.yml --record --key <API_KEY>
```

> Note: Replace `<API_KEY>` with your Artillery Cloud API key.

For comprehensive documentation and advanced configurations, refer to the [official Artillery documentation](https://www.artillery.io/docs/).

## Rate Limiting

Rate limiting is a technique used to control the amount of incoming and outgoing traffic to or from a network. It helps prevent abuse, ensures fair usage, and protects against DDoS attacks.

for more information on rate limiting, refer to the

- [Token Bucket Algorithm](https://www.geeksforgeeks.org/token-bucket-algorithm/).
- [Article](https://medium.com/@anil.goyal0057/rate-limiter-using-token-bucket-algorithm-9911f27ba182)
