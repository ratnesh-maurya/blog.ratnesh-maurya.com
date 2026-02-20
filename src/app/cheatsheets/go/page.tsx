import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbStructuredData, CheatsheetStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Go Cheatsheet — Syntax, Concurrency & CLI | Ratn Labs',
  description: 'Quick reference for Go syntax, goroutines, channels, interfaces, error handling, and common CLI commands.',
  keywords: ['Go cheatsheet', 'Golang cheatsheet', 'Go syntax reference', 'goroutines', 'Go channels', 'Go interfaces', 'Go CLI'],
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/cheatsheets/go' },
  openGraph: {
    title: 'Go Cheatsheet — Ratn Labs',
    url: 'https://blog.ratnesh-maurya.com/cheatsheets/go',
    siteName: 'Ratn Labs',
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'Go Cheatsheet — Ratn Labs', creator: '@ratnesh_maurya' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: 'Variables & Types',
    code: `// Declaration
var x int = 10
x := 10          // short declaration (inside functions)
const Pi = 3.14

// Multiple assignment
a, b := 1, 2
a, b = b, a      // swap

// Zero values: 0, false, "", nil`,
  },
  {
    title: 'Functions',
    code: `// Basic
func add(a, b int) int { return a + b }

// Multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 { return 0, errors.New("division by zero") }
    return a / b, nil
}

// Named return values
func minMax(a, b int) (min, max int) {
    if a < b { return a, b }
    return b, a
}

// Variadic
func sum(nums ...int) int {
    total := 0
    for _, n := range nums { total += n }
    return total
}`,
  },
  {
    title: 'Structs & Methods',
    code: `type User struct {
    ID   int
    Name string
    Age  int
}

// Value receiver (copy)
func (u User) String() string {
    return fmt.Sprintf("%s (%d)", u.Name, u.Age)
}

// Pointer receiver (mutates)
func (u *User) Birthday() { u.Age++ }

// Embedding
type Admin struct {
    User
    Role string
}`,
  },
  {
    title: 'Interfaces',
    code: `type Writer interface {
    Write(p []byte) (n int, err error)
}

// Implicit implementation — no "implements" keyword
type FileWriter struct{ f *os.File }
func (fw FileWriter) Write(p []byte) (int, error) {
    return fw.f.Write(p)
}

// Empty interface
func printAny(v interface{}) { fmt.Println(v) }
// or in Go 1.18+:
func printAny(v any) { fmt.Println(v) }

// Type assertion
if w, ok := v.(Writer); ok { w.Write(data) }

// Type switch
switch t := v.(type) {
case int:   fmt.Println("int:", t)
case string: fmt.Println("string:", t)
}`,
  },
  {
    title: 'Error Handling',
    code: `// Standard pattern
result, err := doSomething()
if err != nil {
    return fmt.Errorf("context: %w", err)
}

// Sentinel errors
var ErrNotFound = errors.New("not found")
if errors.Is(err, ErrNotFound) { /* ... */ }

// Custom error type
type ValidationError struct { Field, Msg string }
func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Msg)
}
var ve *ValidationError
if errors.As(err, &ve) { fmt.Println(ve.Field) }`,
  },
  {
    title: 'Goroutines & Channels',
    code: `// Launch goroutine
go func() { fmt.Println("async") }()

// Unbuffered channel (synchronises sender and receiver)
ch := make(chan int)
go func() { ch <- 42 }()
val := <-ch

// Buffered channel
ch := make(chan int, 10)

// Select — multiplex channels
select {
case msg := <-ch1:   fmt.Println("ch1:", msg)
case msg := <-ch2:   fmt.Println("ch2:", msg)
case <-time.After(1 * time.Second): fmt.Println("timeout")
}

// Close and range over channel
close(ch)
for v := range ch { fmt.Println(v) }`,
  },
  {
    title: 'Sync Primitives',
    code: `// Mutex
var mu sync.Mutex
mu.Lock()
defer mu.Unlock()

// RWMutex
var rw sync.RWMutex
rw.RLock(); defer rw.RUnlock()  // read
rw.Lock();  defer rw.Unlock()   // write

// WaitGroup
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        work(id)
    }(i)
}
wg.Wait()

// sync.Once
var once sync.Once
once.Do(func() { /* runs exactly once */ })`,
  },
  {
    title: 'Context',
    code: `// With timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// With cancellation
ctx, cancel := context.WithCancel(context.Background())
go func() {
    <-someSignal
    cancel()
}()

// Pass context through call chain
func fetchUser(ctx context.Context, id int) (*User, error) {
    return db.QueryContext(ctx, "SELECT * FROM users WHERE id=$1", id)
}

// Check if context is done
select {
case <-ctx.Done():
    return ctx.Err()
default:
}`,
  },
  {
    title: 'Common CLI Commands',
    code: `go run main.go          # run without building
go build ./...          # build all packages
go test ./...           # run all tests
go test -race ./...     # run with race detector
go test -cover ./...    # show coverage
go mod tidy             # clean up go.mod/go.sum
go mod download         # download dependencies
go vet ./...            # static analysis
go fmt ./...            # format code
go doc fmt.Println      # show docs for a symbol
gopls                   # language server (IDE)`,
  },
];

export default function GoCheatsheetPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Cheatsheets', url: 'https://blog.ratnesh-maurya.com/cheatsheets' },
    { name: 'Go', url: 'https://blog.ratnesh-maurya.com/cheatsheets/go' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CheatsheetStructuredData
        title="Go Cheatsheet — Syntax, Concurrency & CLI"
        description="Quick reference for Go syntax, goroutines, channels, interfaces, error handling, and common CLI commands."
        slug="go"
        keywords={['Go', 'Golang', 'goroutines', 'channels', 'interfaces', 'error handling', 'Go CLI', 'concurrency']}
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
            <span className="text-4xl">🐹</span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Go Cheatsheet
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Syntax, concurrency, error handling, and CLI reference
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
