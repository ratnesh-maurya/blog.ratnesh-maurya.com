import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbStructuredData, CheatsheetStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Docker Cheatsheet — Dockerfile, Commands & Compose | Ratn Labs',
  description: 'Quick reference for Docker CLI commands, Dockerfile instructions, docker-compose, volumes, networks, and multi-stage builds.',
  keywords: ['Docker cheatsheet', 'Dockerfile reference', 'docker-compose commands', 'Docker CLI', 'Docker volumes', 'Docker networks'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets/docker' },
  openGraph: {
    title: 'Docker Cheatsheet — Ratn Labs',
    url: 'https://blog.ratnesh-maurya.com/cheatsheets/docker',
    siteName: 'Ratn Labs',
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'Docker Cheatsheet — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: 'Dockerfile — Core Instructions',
    code: `FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .

FROM alpine:3.19
RUN adduser -D appuser
USER appuser
COPY --from=builder /app/server /server
EXPOSE 8080
CMD ["/server"]`,
  },
  {
    title: 'Dockerfile — Common Instructions',
    code: `FROM image:tag         # base image
WORKDIR /app          # set working directory
COPY src dest         # copy files from host
ADD src dest          # like COPY but also handles URLs & .tar
RUN command           # run during build
CMD ["cmd", "arg"]    # default command (can be overridden)
ENTRYPOINT ["cmd"]    # fixed executable
ENV KEY=value         # set environment variable
ARG NAME=default      # build-time variable
EXPOSE 8080           # document port (does not publish)
VOLUME ["/data"]      # create mount point
LABEL key="value"     # metadata`,
  },
  {
    title: 'Container Lifecycle',
    code: `docker run -d -p 8080:8080 --name api myimage   # run detached
docker run -it ubuntu bash                       # interactive shell
docker run --rm myimage                          # remove after exit
docker start/stop/restart container_name
docker pause/unpause container_name
docker rm container_name                         # remove stopped
docker rm -f container_name                     # force remove running
docker ps                                       # list running
docker ps -a                                    # list all`,
  },
  {
    title: 'Images',
    code: `docker build -t myapp:1.0 .              # build
docker build --no-cache -t myapp .       # build without cache
docker build --target builder -t myapp . # multi-stage: specific stage
docker images                            # list images
docker rmi image_id                      # remove image
docker pull nginx:alpine                 # pull from registry
docker push registry/myapp:tag           # push to registry
docker tag myapp registry/myapp:latest   # tag image
docker inspect image_id                  # full metadata`,
  },
  {
    title: 'Logs & Debugging',
    code: `docker logs container_name              # view logs
docker logs -f container_name           # follow (tail -f)
docker logs --tail 100 container_name   # last 100 lines
docker exec -it container_name bash     # shell into running container
docker exec container_name env          # run command in container
docker cp container:/path/file .        # copy file from container
docker stats                            # live resource usage
docker inspect container_name          # full details`,
  },
  {
    title: 'Volumes & Networks',
    code: `# Volumes
docker volume create mydata
docker volume ls
docker volume rm mydata
docker run -v mydata:/app/data myimage  # named volume
docker run -v $(pwd):/app myimage       # bind mount

# Networks
docker network create mynet
docker network ls
docker run --network mynet myimage
docker network connect mynet container_name
docker network inspect mynet`,
  },
  {
    title: 'docker-compose',
    code: `# docker-compose.yml
version: '3.9'
services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      - DB_URL=postgres://user:pass@db:5432/mydb
    depends_on: [db]
    volumes: ["./config:/app/config"]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes: ["pgdata:/var/lib/postgresql/data"]

volumes:
  pgdata:`,
  },
  {
    title: 'docker-compose Commands',
    code: `docker compose up -d          # start in background
docker compose up --build     # rebuild and start
docker compose down           # stop and remove containers
docker compose down -v        # also remove volumes
docker compose logs -f api    # follow service logs
docker compose exec api bash  # shell into service
docker compose ps             # list service status
docker compose restart api    # restart one service
docker compose pull           # pull latest images`,
  },
  {
    title: 'Cleanup',
    code: `docker system prune           # remove all stopped containers, unused images
docker system prune -a        # also remove unused images (not just dangling)
docker container prune        # remove stopped containers
docker image prune            # remove dangling images
docker volume prune           # remove unused volumes
docker network prune          # remove unused networks`,
  },
];

export default function DockerCheatsheetPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Cheatsheets', url: 'https://blog.ratnesh-maurya.com/cheatsheets' },
    { name: 'Docker', url: 'https://blog.ratnesh-maurya.com/cheatsheets/docker' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CheatsheetStructuredData
        title="Docker Cheatsheet — Dockerfile, Commands & Compose"
        description="Quick reference for Docker CLI commands, Dockerfile instructions, docker-compose, volumes, networks, and multi-stage builds."
        slug="docker"
        keywords={['Docker', 'Dockerfile', 'docker-compose', 'Docker CLI', 'Docker volumes', 'Docker networks', 'multi-stage build']}
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
            <span className="text-4xl">🐳</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Docker Cheatsheet
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Dockerfile, CLI commands, docker-compose, volumes, and networks
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
