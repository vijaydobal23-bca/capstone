import { k8sCoreV1Api } from "./config.js";

export const createService = async (sandboxId) => {
  const serviceManifeast = {
    metadata: {
      name: `sandbox-service-${sandboxId}`,
      labels: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },

    spec: {
      selector: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },

    ports: [
      {
        protocol: "TCP",
        port: 80,
        targetPort: 5173,
      },
    ],

    type: "ClusterIP",
  };
};

const response = await k8sCoreV1Api.createNamespacedService({
  namespace:"default",
  body:serviceManifeast
})

console.log("Service created successfully", response.body.metadata.name);

export default response
