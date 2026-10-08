# Hook formulas for carousel covers

Adapted from the 26 formulas in `skills/ig-reel/hooks.json` of
[instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill)
(Copyright (c) Jake Schincariol, MIT License). Used here as a **menu to vary the
cover line**, not as a score: the author's own test found hook scoring catches bad
hooks but does not pick winners.

## How to use it

1. Pick **one formula** for the cover line (slide 1). Say which one in your Step 3 analysis.
2. When making several carousels in one batch, **assign each a different formula**
   up front. Five covers on the same shape read like a content mill.
3. Cover = **8 words or fewer**, concrete (a number, a name, a before/after), no
   greeting, no "stop scrolling", no "in this post".
4. Check `reels/*/caption.txt` first lines to avoid repeating a shape you already posted.
5. **Only assign formulas from the "Fit for explainers" table.** The first-person table
   needs a real story from `voice.md`; assigning one of those to an agent just makes it
   switch formulas (this already happened with Head To Head).

## Fit for explainers (usable as is)

These work with facts from the source, so they are safe on a faceless carousel.

| Formula | Template | Why it works |
|---|---|---|
| **Negative Command** | Stop {common action}. Do {alternative} instead. | Saves and arguments |
| **Nobody Tells You** | Nobody tells you that {uncomfortable truth about the thing they want}. | New audiences |
| **The Replacement** | {This thing} replaced {expensive thing} for {price}. | Demos and tool videos |
| **Wrong Way, Right Way** | You are doing {thing} wrong, and it is not your fault. {The fix}. | Teaching |
| **If This, Then Watch** | If you {specific situation}, this {short time} fixes it. | Qualifying hard |
| **Numbered With A Favourite** | {N} {things} that {outcome}. Number {k} is the one nobody uses. | Retention through the middle: naming a favourite gives people a reason to stay past three |
| **The Objection** | "{Objection they actually say}." Fine. Here is the version that works anyway. | Selling to the people who already said no once |
| **Before And After, On Screen** | {Show the old thing}. {Show the new thing}. {One sentence on the lever}. | Anything visual |
| **The Callout** | {Specific group}, this is the one you have been ignoring. | Cutting a broad audience down to the one that converts |
| **Cold Open Demo** | {Start mid-action, already doing the thing.} Watch what this does. | Screen recordings and anything with a visible result |
| **The Deadline** | {Thing} changes on {date}. Do {action} before then. | Urgency that is real |
| **Permission** | You do not need {the thing everyone says you need}. | Relief |
| **Mid-Sentence Start** | {...and that is when {the turn}.} | Stories |
| **Contrarian Flip** | {Well-known saying, inverted.} | Comments |
| **The Statistic** | {N}% of {group} {surprising fact}. | Sends |
| **The Reveal** | This is the new {thing}. | Anything physical or visual |
| **Someone Else's Result** | There was one {person} who {outcome} in {time}. | Proof when the user does not have their own number yet |
| **The Superlative** | The {fastest / biggest / only} {thing} is {the answer}. | One-claim videos with no story attached |

## Needs a real story from the author

These are first person. **Never invent the story.** Use them only when `voice.md`
lists a real experience, number or result that backs the claim. Otherwise pick a
formula from the table above.

| Formula | Template | Why it works |
|---|---|---|
| **Cost Confession** | {Specific amount} is what {one mistake} cost me. | Trust, fast |
| **Time Collapse** | This used to take me {long time}. It now takes {short time}. | Process videos where the payoff is speed |
| **The Receipt** | I {did thing} for {N days}. Here are the actual numbers. | Experiments |
| **Insider Leak** | I spent {N years} {inside the thing}. Here is what we never said out loud. | Authority without a credential slide |
| **The Steal** | Steal this {artifact}. It took me {time} to get right. | Saves and sends, which are the two metrics that move reach the most |
| **The Verbatim Question** | "{Question exactly as it was asked}" - I get this every week. | Search |
| **Head To Head** | {A} versus {B}. I ran both for {time} and one of them was not close. | Comments |
| **The Flop Record** | My first {N} {attempts} did nothing. Here is what changed on {N+1}. | People at the start, which is most of the audience |

## Our own covers, for reference

- "Retry five times. Get charged once." — a before/after in one line.
- "Reorder Go struct fields. Save 152 MB." — a command plus a number.
- "Still on Go 1.26.1? Time to patch." — a deadline aimed at one group.
- "Know what's NOT there — without looking." — a promise that sounds impossible.
