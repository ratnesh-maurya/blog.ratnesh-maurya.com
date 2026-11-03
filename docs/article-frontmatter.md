# Article frontmatter

Fields read from `content/blog/<slug>.md` or `.mdx` by `src/lib/content.ts`.

## Existing

`title`, `description`, `date`, `updated`, `author`, `category`, `tags`, `image`,
`socialImage`, `featured`, `questions`.

- `date` is the publish date. `updated` is the last substantive edit; set it by hand when you
  actually change the article. Nothing sets it automatically, and builds never touch it.
- `updated` (or `modified`) feeds `dateModified` in JSON-LD, `article:modified_time` and the
  sitemap `lastmod`. It is shown on the page only when it is later than `date`.

## Optional technical fields

All optional; an article without them renders exactly as before. Invalid values (non-strings,
non-http(s) URLs, references missing a title or url) are dropped silently by
`src/lib/technicalMeta.ts`.

```yaml
language: Go
framework: Next.js
softwareVersion: "Go 1.23"
testedEnvironment: "macOS 15, PostgreSQL 16"   # only what you really ran the code on
repo: https://github.com/ratnesh-maurya/example
references:
  - title: Go documentation
    url: https://go.dev/doc/
```

- `language`, `framework`, `softwareVersion`, `testedEnvironment`, `repo` show in a "Technical
  details" box under the title.
- `references` show as a numbered "References" list after the article and are emitted as
  `citation` in the article's JSON-LD.

## Pages generated from frontmatter

- `/blog/tag/<tag>/` for every tag and `/blog/category/<category>/` for every category. Both
  are in the sitemap and have breadcrumbs. Unknown slugs return 404.
