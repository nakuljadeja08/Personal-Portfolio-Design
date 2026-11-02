"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { commandAliases, commandCopy, commands, commandSuggestions, type Command } from "@/content/commands";
import { FINTECH_EVENT } from "@/lib/referrer";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./CommandBox.module.css";

const TYPE_MS = 12;

type Exchange = { question: string; result: Command };

function lookup(raw: string): { key: string; result: Command } {
  const query = raw.trim().toLowerCase().replace(/^\//, "");
  const key = commandAliases[query] ?? query;
  // Own keys only, so typing "constructor" gets a miss and not a crash.
  return Object.hasOwn(commands, key) ? { key, result: commands[key] } : { key, result: { answer: commandCopy.miss } };
}

function AnswerLink({ label, href, onLeave }: { label: string; href: string; onLeave: () => void }) {
  if (href.endsWith(".pdf")) return <a href={href} download>{label}</a>;
  if (href.startsWith("http")) return <a href={href} target="_blank" rel="noreferrer">{label}</a>;
  return <a href={href} onClick={onLeave}>{label}</a>;
}

export function CommandBox() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [typed, setTyped] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const answer = exchange?.result.answer ?? "";
  const finished = reduced || typed >= answer.length;

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === "Escape") {
        setOpen((wasOpen) => {
          if (wasOpen) trigger.current?.focus();
          return false;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    if (reduced || !answer) return;
    const timer = setInterval(() => {
      setTyped((count) => {
        if (count + 1 >= answer.length) clearInterval(timer);
        return count + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(timer);
  }, [answer, reduced, exchange]);

  const ask = (raw: string) => {
    if (!raw.trim()) return;
    const { key, result } = lookup(raw);
    setTyped(0);
    setExchange({ question: raw.trim(), result });
    if (key === "fintech") window.dispatchEvent(new Event(FINTECH_EVENT));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.current) return;
    ask(input.current.value);
    input.current.value = "";
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`nl-data ${styles.trigger}`}
        aria-expanded={open}
        aria-controls="command-box"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className={styles.prompt} aria-hidden="true">&gt;</span> {commandCopy.trigger}
      </button>

      {open && (
        <div id="command-box" className={`nl-panel ${styles.box}`} role="dialog" aria-label={commandCopy.title}>
          <div className={`nl-label ${styles.head}`}>
            <span>{commandCopy.title}</span>
            <span className={styles.hint}>{commandCopy.hint}</span>
            <button type="button" className={`nl-label ${styles.close}`} onClick={close}>
              {commandCopy.close}
            </button>
          </div>

          <div className={`nl-data ${styles.log}`}>
            {exchange ? (
              <>
                <p className={styles.question}>
                  <span className={styles.prompt} aria-hidden="true">&gt;</span> {exchange.question}
                </p>
                <p className={styles.answer} aria-hidden="true">
                  {reduced ? answer : answer.slice(0, typed)}
                </p>
                <p className="nl-sr" aria-live="polite">{answer}</p>
                {finished && exchange.result.links && (
                  <p className={styles.links}>
                    {exchange.result.links.map((link) => (
                      <AnswerLink key={link.href} {...link} onLeave={() => setOpen(false)} />
                    ))}
                  </p>
                )}
              </>
            ) : (
              <p className={styles.answer}>{commandCopy.welcome}</p>
            )}
          </div>

          <form className={`nl-data ${styles.form}`} onSubmit={onSubmit}>
            <span className={styles.prompt} aria-hidden="true">&gt;</span>
            <input
              ref={input}
              type="text"
              placeholder={commandCopy.placeholder}
              aria-label={commandCopy.inputLabel}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </form>

          <p className={styles.suggestions}>
            {commandSuggestions.map((suggestion) => (
              <button key={suggestion} type="button" className="nl-chip" onClick={() => ask(suggestion)}>
                {suggestion}
              </button>
            ))}
          </p>
        </div>
      )}
    </>
  );
}
