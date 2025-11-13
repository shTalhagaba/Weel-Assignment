FROM golang:1.21-alpine

WORKDIR /app

# Install dependencies for health check
RUN apk add --no-cache wget

# Install dependencies first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy ALL source code (since we're in root)
COPY *.go ./
COPY models/ ./models/
COPY handlers/ ./handlers/
COPY middleware/ ./middleware/
COPY database/ ./database/
COPY tests/ ./tests/

# Build the application
RUN go build -o main .

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./main"]