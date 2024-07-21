This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash

npm  run  dev
# or

yarn  dev

# or

pnpm  dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# Getting Started with Docker

Docker enables us to encapsulate our application in containers, ensuring that it runs uniformly and consistently across any environment.

## Steps:

### 1. Installation:

- Navigate to the [Docker official site](https://www.docker.com/products/docker-desktop/) and download the latest version of Docker Desktop. After installation, sign up or log in to your Docker account.

### 2. Setting Up Your File Structure:

- For Docker to function correctly, organize your file structure as follows:

  ![Your File Structure Image](https://i.gyazo.com/89dece9ce4fde996f737a094fe69d6c5.png)

  Create a new folder at any desired location. Within this folder, clone both repositories (`Squared-front` and `squared-server`). Ensure you clone these repositories into the same directory, not into separate folders.

### 3. Understanding Dockerfiles:

- Each repository contains a `Dockerfile`. This file serves as the blueprint for the development environment, specifying the required Node.js versions, dependencies, and files. It’s crucial for creating the Docker image.

### 4. Using docker-compose:

- The `docker-compose.yaml` file in the `Squared-front` repository instructs Docker on how to build the Dockerfiles into images, which can then be run as containers. To initiate the containers via this compose file, execute `docker-compose up` in your terminal (In the Squared-front directory)

### 5. Observing the Running Containers:

- After running `docker-compose up`, you should see the containers appearing in the Docker Desktop App, signifying they are up and running.

  ![Containers in Docker App](https://i.gyazo.com/b8f17d07d3db3f86909c200a26f319b2.png)

### 6. Cleanup:

- To remove the containers, use `docker-compose down`. Occasionally, you may need to manually delete the images and volumes via the app, especially if reinitialization is required.

### 7. Development:

- With the containers active, you can proceed with development as usual. Live reload has been enabled to streamline the development process.

# Using Material Tailwind Components Library

- https://www.material-tailwind.com/

The app has been installed with Material Tailwind as the components library, which will speed up development.

Uniformity across the app is necessary, so you can just use this library when you want to use a component library.

## Setup and Installation Of Material Tailwind

This has already been done, and I have included the information below for you to review.

Install the npm package: `npm install @material-tailwind/react`

In the tailwind.config.js add a function to wrap the existing Tailwind Configuration:

```
const { withMt } = require('@material-tailwind/react');

module.exports = withMt({
  // Your existing Tailwind configuration
  // ...
});
```

## Usage

Now, you can use Material Tailwind components in your React app. Here's an example of how to use a button component.

### Button Variants

The Button component has 4 different variants you can change using the variant prop.

```
import { Button } from "@material-tailwind/react";

export function ButtonVariants() {
  return (
    <div className="flex w-max gap-4">
      <Button variant="filled">filled</Button>
      <Button variant="gradient">gradient</Button>
      <Button variant="outlined">outlined</Button>
      <Button variant="text">text</Button>
    </div>
  );
}
```

In this example, we import the Button component from @material-tailwind/react and use it in our app. The variant prop specifies the button's style.

### Button Sizes

The button component comes in 3 sizes that you can change using the size prop.

```
import { Button } from "@material-tailwind/react";

export function ButtonSizes() {
  return (
    <div className="flex w-max items-end gap-4">
      <Button size="sm">small</Button>
      <Button size="md">medium</Button>
      <Button size="lg">large</Button>
    </div>
  );
}
```

### Loading Button

Using the loading prop, you can add a loading state and disable the Button component.

```
import { Button } from "@material-tailwind/react";

export function ButtonLoading() {
  return (
    <div className="flex items-center gap-4">
      <Button loading={true}>Loading</Button>
      <Button variant="outlined" loading={true}>
        Loading
      </Button>
      <Button variant="text" loading={true}>
        Loading
      </Button>
      <Button className="rounded-full" loading={true}>
        Loading
      </Button>
    </div>
  );
}
```

The documentation gives more examples of the button options and includes the results in the browser for you to see. Follow this link for the button component: https://www.material-tailwind.com/docs/react/button

## Material Tailwind Documentation

For more information on how to use Material Tailwind components, customize the theme, and use plugins, please refer to the official Material Tailwind documentation. The documentation provides detailed examples and guides on how to use each component and configure the theme and plugins.

Useful plugins include a date picker and charts.

You can find the documentation at the following link: https://www.material-tailwind.com/docs/react/installation

Explore the documentation to get more insights on how to use Material Tailwind effectively in the app.

# Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
