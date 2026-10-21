import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId) {
  const podManifeast = {
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [{ name: "workspace_volume", emptyDir: {} }],
      initContainers:[
       {
        name:"init-container",
        image:"template",
        imagePullPolicy:"IfNotPresent",
        command:["sh","-c","cp -r /workspace/* ./seed"],
        volumeMounts:[
          {
            name:"workspace-volume",
            mountPath:"/seed"
          }
        ]
       }
      ],
      containers: [
        {
          image: "template",
          imagePullPolicy: "IfNotPresent",
          name: "sandbox-contaienr",
          ports: [
            {
              containerPort: 5173,
              name: "http",
            },
          ],
          resources: {
            limits: {
              cpu: "500m",
              memory: "1Gi",
            },
            requests: {
              cpu: "250m",
              memory: "500Mi",
            },
            volumeMounts: [
              {
                name: "workspace_volume",
                mountPath: "/workspace",
              },
            ],
          },
        },
        {
          image: "agent",
          imagePullPolicy: "IfNotPresent",
          name: "agent-container",
          ports: [{ containerPort: 5173, name: "http" }],
          resources: {
            limits: { cpu: "500m", memory: "1Gi" },
            requests: {
              cpu: "250m",
              memory: "500Mi",
            },
            volumeMounts: [
              {
                name: "workspace_volume",
                mountPath: "/workspace",
              },
            ],  
          },
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: "default",
    body: podManifeast,
  });
  console.log("Pod created sucessfully", response.body.metadata.name);
  return response;
}
