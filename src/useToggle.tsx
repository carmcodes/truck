import { useStore } from './store'

import type { ComponentType, PropsWithChildren } from 'react'
import type { IState } from './store'

type IStateKey = keyof IState

export const useToggle =
  <P extends {}>(ToggledComponent: ComponentType<P>, toggle: IStateKey | IStateKey[]) =>
  (props: PropsWithChildren<P>) => {
    const keys = Array.isArray(toggle) ? toggle : [toggle]
    const values = useStore((state) => keys.map((key) => state[key]))
    return values.every((v) => !!v) ? <ToggledComponent {...props} /> : props.children ? <>{props.children}</> : null
  }


    import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  template: `
    <div class="scene">
      <!-- background glow layers -->
      <div class="bg bg-1"></div>
      <div class="bg bg-2"></div>
      <div class="grain"></div>

      <main class="wrap" role="main" aria-labelledby="pageTitle">
        <section class="card">
          <div class="badge" aria-hidden="true">
            <svg class="lock" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z"/>
            </svg>
          </div>

          <header class="head">
            <h1 id="pageTitle" class="code">403</h1>
            <h2 class="title">Access denied</h2>
            <p class="subtitle">
              {{ message || 'You don’t have permission to view this resource.' }}
            </p>

            <div *ngIf="requiredRoles?.length" class="requirements" aria-live="polite">
              <span class="req-label">Required:</span>
              <ul class="req-list">
                <li *ngFor="let r of requiredRoles">{{ r }}</li>
              </ul>
            </div>
          </header>

          <nav class="actions" aria-label="Actions">
            <a routerLink="/" class="btn btn-ghost">Go home</a>
            <button (click)="reload()" class="btn btn-primary">Retry</button>
            <a *ngIf="contactHref" [href]="contactHref" class="btn btn-outline">Contact admin</a>
          </nav>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host { display:block; color: var(--fg); }

    /* ===== Theme tokens ===== */
    :root {
      --fg: #0b1220;
      --muted: #5b657a;
      --card: rgba(255,255,255,0.65);
      --border: rgba(255,255,255,0.35);
      --btn: #0b1220;
      --btn-fg: #fff;
      --ring: 0 8px 30px rgba(0,0,0,0.12);
      --radius: 16px;
      --accent1: #7c5cff;
      --accent2: #14b8a6;
      --accent3: #60a5fa;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --fg: #e7ecff;
        --muted: #9aa3b2;
        --card: rgba(15,18,28,0.6);
        --border: rgba(255,255,255,0.08);
        --btn: #e7ecff;
        --btn-fg: #0b1220;
        --ring: 0 10px 40px rgba(0,0,0,0.5);
      }
    }

    /* ===== Background ===== */
    .scene { position:relative; min-height: 100dvh; overflow:hidden; }
    .bg { position:absolute; inset:-20% -10%; filter: blur(80px); opacity:0.6; animation: float 16s ease-in-out infinite; }
    .bg-1 { background: radial-gradient(600px 600px at 15% 20%, var(--accent1), transparent 60%); animation-delay: -4s; }
    .bg-2 { background: radial-gradient(700px 700px at 85% 80%, var(--accent2), transparent 60%); animation-delay: -10s; }
    .grain { position:absolute; inset:0; pointer-events:none; opacity:.08; mix-blend: overlay;
      background-image: url("data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>\
      <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter>\
      <rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
      animation: grain 7s steps(10) infinite; }

    @keyframes float { 0%,100%{ transform: translateY(-2%);} 50%{ transform: translateY(2%);} }
    @keyframes grain { 0%{transform:translate(0,0)} 100%{transform:translate(-10%,10%)} }

    /* ===== Layout ===== */
    .wrap { position:relative; z-index:1; display:grid; place-items:center; padding: clamp(24px, 4vw, 48px); }
    .card {
      width: min(680px, 92vw);
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--ring);
      backdrop-filter: blur(12px) saturate(120%);
      -webkit-backdrop-filter: blur(12px) saturate(120%);
      padding: clamp(20px, 5vw, 40px);
      position:relative;
      overflow:hidden;
      isolation:isolate;
    }

    /* gradient border shimmer */
    .card::before {
      content:"";
      position:absolute; inset:-1px;
      border-radius: inherit;
      padding:1px;
      background: conic-gradient(from 180deg at 50% 50%, var(--accent1), var(--accent3), var(--accent2), var(--accent1));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      animation: spin 12s linear infinite;
      opacity:.35;
    }
    @keyframes spin { to { transform: rotate(1turn); } }

    .head { text-align:center; margin: 0 auto; max-width: 56ch; }
    .badge {
      width: 84px; height:84px; margin: 0 auto 18px; border-radius: 999px;
      display:grid; place-items:center;
      background: radial-gradient(100% 100% at 50% 50%, rgba(255,255,255,.6), rgba(255,255,255,.2));
      border: 1px solid var(--border);
      box-shadow: 0 10px 30px rgba(0,0,0,.1), inset 0 0 22px rgba(255,255,255,.25);
    }
    .lock { width: 36px; height:36px; fill: currentColor; color: var(--fg); animation: bounce 2.4s ease-in-out infinite; }
    @keyframes bounce { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-6px);} }

    .code {
      font-size: clamp(48px, 10vw, 116px);
      line-height: 0.9;
      margin: 6px 0;
      letter-spacing: -0.02em;
      background: linear-gradient(120deg, var(--accent1), var(--accent3), var(--accent2));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,.15));
      position:relative;
    }
    .code::after {
      content:"";
      position:absolute; inset:0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.35) 50%, transparent 100%);
      transform: translateX(-100%);
      animation: shine 3.8s ease-in-out infinite 1.2s;
      -webkit-mask: linear-gradient(#000, #000);
    }
    @keyframes shine { 0% { transform: translateX(-120%);} 60%{ transform: translateX(120%);} 100%{ transform: translateX(120%);} }

    .title { font-size: clamp(20px, 3vw, 28px); margin: 4px 0 6px; }
    .subtitle { margin: 0 auto 14px; color: var(--muted); }

    .requirements { margin-top: 10px; color: var(--muted); font-size: 0.95rem; }
    .req-label { font-weight: 600; margin-right: 6px; }
    .req-list { display:inline-flex; gap:.5rem; list-style:none; padding:0; margin:0; }
    .req-list li {
      padding: 4px 10px; border-radius: 999px; border:1px dashed var(--border);
      background: rgba(255,255,255,.35);
    }
    @media (prefers-color-scheme: dark) {
      .req-list li { background: rgba(255,255,255,.04); }
    }

    .actions { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top: 22px; }
    .btn {
      appearance: none; border:1px solid transparent; border-radius: 12px;
      padding: 10px 16px; font-weight:600; cursor:pointer; transition: transform .08s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
      will-change: transform;
    }
    .btn:active { transform: translateY(1px) scale(0.99); }
    .btn-primary {
      background: var(--btn); color: var(--btn-fg); box-shadow: 0 10px 20px rgba(0,0,0,.15);
    }
    .btn-primary:hover { box-shadow: 0 12px 26px rgba(0,0,0,.22); }
    .btn-outline {
      background: transparent; border-color: var(--border); color: var(--fg);
      backdrop-filter: blur(6px);
    }
    .btn-outline:hover { background: rgba(255,255,255,.5); }
    .btn-ghost {
      background: rgba(255,255,255,.35); color: var(--fg); border-color: var(--border);
    }
    @media (prefers-color-scheme: dark) {
      .btn-ghost { background: rgba(255,255,255,.06); }
      .btn-outline:hover { background: rgba(255,255,255,.08); }
    }

    /* motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .bg, .grain, .lock, .card::before, .code::after { animation: none !important; }
    }
  `]
})
export class ForbiddenPage {
  @Input() message?: string;
  @Input() requiredRoles?: string[];
  @Input() contactHref?: string;

  reload() { window.location.reload(); }
}
    
