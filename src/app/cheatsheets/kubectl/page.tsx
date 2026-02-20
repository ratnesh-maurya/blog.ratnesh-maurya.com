import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbStructuredData, CheatsheetStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'kubectl Cheatsheet — Kubernetes CLI Reference | Ratn Labs',
  description: 'Quick reference for kubectl commands — pods, deployments, services, configmaps, debugging, and rollouts.',
  keywords: ['kubectl cheatsheet', 'Kubernetes CLI', 'kubectl commands', 'kubectl reference', 'kubernetes pods', 'kubectl debug'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets/kubectl' },
  openGraph: {
    title: 'kubectl Cheatsheet — Ratn Labs',
    url: 'https://blog.ratnesh-maurya.com/cheatsheets/kubectl',
    siteName: 'Ratn Labs',
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'kubectl Cheatsheet — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: 'Context & Cluster',
    code: `kubectl config get-contexts              # list all contexts
kubectl config current-context            # current context
kubectl config use-context my-cluster     # switch context
kubectl config set-context --current --namespace=dev  # set default namespace
kubectl cluster-info                      # cluster info
kubectl get nodes                         # list nodes
kubectl get nodes -o wide                 # with IPs and OS info`,
  },
  {
    title: 'Pods',
    code: `kubectl get pods                          # list pods (current namespace)
kubectl get pods -n kube-system           # list in namespace
kubectl get pods -A                       # list all namespaces
kubectl get pods -o wide                  # with node and IP
kubectl get pod mypod -o yaml             # full pod spec
kubectl describe pod mypod                # events and details
kubectl logs mypod                        # pod logs
kubectl logs mypod -c container-name      # specific container
kubectl logs mypod -f                     # follow (tail -f)
kubectl logs mypod --previous             # logs from crashed container
kubectl exec -it mypod -- bash            # shell into pod
kubectl exec mypod -- env                 # run command in pod
kubectl delete pod mypod                  # delete pod
kubectl delete pod mypod --force          # force delete (stuck pods)`,
  },
  {
    title: 'Deployments',
    code: `kubectl get deployments
kubectl describe deployment myapp
kubectl create deployment myapp --image=myimage:1.0
kubectl scale deployment myapp --replicas=3
kubectl set image deployment/myapp app=myimage:2.0   # update image
kubectl rollout status deployment/myapp              # watch rollout
kubectl rollout history deployment/myapp             # revision history
kubectl rollout undo deployment/myapp                # rollback
kubectl rollout undo deployment/myapp --to-revision=2
kubectl edit deployment myapp                        # live edit`,
  },
  {
    title: 'Services',
    code: `kubectl get services
kubectl describe service myapp
kubectl expose deployment myapp --port=80 --target-port=8080
kubectl port-forward svc/myapp 8080:80     # local port forward
kubectl port-forward pod/mypod 8080:8080   # forward to pod
kubectl delete service myapp`,
  },
  {
    title: 'ConfigMaps & Secrets',
    code: `# ConfigMap
kubectl create configmap myconfig --from-literal=KEY=value
kubectl create configmap myconfig --from-file=config.yaml
kubectl get configmap myconfig -o yaml
kubectl delete configmap myconfig

# Secret
kubectl create secret generic mysecret --from-literal=password=s3cr3t
kubectl create secret generic mysecret --from-file=.dockerconfigjson
kubectl get secret mysecret -o jsonpath='{.data.password}' | base64 -d
kubectl delete secret mysecret`,
  },
  {
    title: 'Namespaces',
    code: `kubectl get namespaces
kubectl create namespace staging
kubectl delete namespace staging
# Run command in specific namespace
kubectl get pods -n staging
# Set default namespace for session
kubectl config set-context --current --namespace=staging`,
  },
  {
    title: 'Debugging',
    code: `# Events (most useful first stop for debugging)
kubectl get events --sort-by='.lastTimestamp'
kubectl get events -n mynamespace

# Resource usage
kubectl top pods
kubectl top nodes

# Debug with ephemeral container (k8s 1.23+)
kubectl debug -it mypod --image=busybox --target=mycontainer

# Copy files to/from pod
kubectl cp mypod:/app/log.txt ./log.txt
kubectl cp ./config.yaml mypod:/app/config.yaml

# Apply and dry-run
kubectl apply -f manifest.yaml --dry-run=client
kubectl diff -f manifest.yaml`,
  },
  {
    title: 'Apply & Delete',
    code: `kubectl apply -f deployment.yaml         # apply manifest
kubectl apply -f ./k8s/                  # apply directory
kubectl apply -k ./kustomize/            # apply kustomize dir
kubectl delete -f deployment.yaml        # delete from manifest
kubectl replace -f deployment.yaml       # replace (not patch)
kubectl patch deployment myapp -p '{"spec":{"replicas":5}}'`,
  },
  {
    title: 'Labels & Selectors',
    code: `kubectl get pods -l app=myapp            # filter by label
kubectl get pods -l 'env in (prod,staging)'
kubectl label pod mypod tier=frontend    # add label
kubectl label pod mypod tier-            # remove label
kubectl annotate pod mypod note="debug"  # add annotation`,
  },
];

export default function KubectlCheatsheetPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Cheatsheets', url: 'https://blog.ratnesh-maurya.com/cheatsheets' },
    { name: 'kubectl', url: 'https://blog.ratnesh-maurya.com/cheatsheets/kubectl' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CheatsheetStructuredData
        title="kubectl Cheatsheet — Kubernetes CLI Reference"
        description="Quick reference for kubectl commands — pods, deployments, services, configmaps, debugging, and rollouts."
        slug="kubectl"
        keywords={['kubectl', 'Kubernetes CLI', 'kubectl commands', 'kubectl reference', 'pods', 'deployments', 'kubectl debug']}
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <Link href="/cheatsheets" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Cheatsheets
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <span className="text-4xl">☸️</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                kubectl Cheatsheet
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Pods, deployments, services, debugging, and cluster management
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map(section => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--text-muted)' }}>
                  {section.title}
                </h2>
                <pre className="rounded-xl p-5 text-sm leading-relaxed overflow-x-auto"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono, monospace)' }}>
                  <code>{section.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
