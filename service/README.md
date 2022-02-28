<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://orcaworkflows.com">
    <img src="orca/public/logo_simple.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Orca Workflows</h3>

  <p align="center">
    No-code data orchestration platform.
    <br />
    <a href="https://orcaworkflows.com"><strong>Explore»</strong></a>
    <br />
    <br />
    <a>
    This is OrcaWorkflows' service repository. Please refer to below for
    other components.
    </a>
    <br />
    <a href="https://github.com/OrcaWorkflows/orca/orca">Orca</a>
    |
    <a href="https://github.com/OrcaWorkflows/orca/operators">Orca Operators</a>
    |
    <a href="https://github.com/OrcaWorkflows/orca/charts">Orca Charts</a>
    <br />
    <br />
    <a href="https://www.orcaworkflows.com/#about">View Demo</a>
    ·
    <a href="https://github.com/OrcaWorkflows/orca/issues">Report Bug</a>
    ·
    <a href="https://github.com/OrcaWorkflows/orca/issues">Request Feature</a>
  </p>
</div>


<!-- ABOUT THE ORCA SERVICE REPOSITORY -->
### About The Orca Service Repository

Orca Service repository is source of OrcaWorkflows' backend component implemented on top of SpringBoot Framework.


<!-- BUILDING DOCKER IMAGE -->
### Building Docker Image
1. Build Orca Service image.
```sh
  docker build -t orca/orca-service:latest service/Dockerfile
```
2. Push the image to your Docker Registry.
```sh
  docker push -t orca/orca-service:latest service/Dockerfile
```

<!-- DEPLOYING DOCKER IMAGE -->
### Deploying Docker Image
Deployment will be executed automatically when you define your Docker registry to the Kubernetes cluster.

Please refer to [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

### Configuration through Environment Variables
##### Orca Service General Configs
| Variable          | Default | Detail                  | Type   |
|-------------------|---------|-------------------------|--------|
| POSTGRES_HOST     |         | PostgreSQL host url     | String |
| POSTGRES_USERNAME |         | PostgreSQL username     | String |
| POSTGRES_PASS     |         | PostgreSQL password     | String |
| ARGO_URL          |         | Argo Workflows host url | String |
