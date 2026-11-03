import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

/**
 * Fades an element up as it scrolls into view.
 *
 * Uses IntersectionObserver rather than a scroll listener so the browser does
 * the work off the main thread. Elements start hidden only when the observer
 * is actually going to run — if it is unavailable, or the visitor prefers
 * reduced motion, the element is shown immediately and never hidden, so the
 * page can never get stuck blank.
 */
@Directive({ selector: '[hfReveal]' })
export class RevealDirective implements OnInit, OnDestroy {
  /** Stagger, in ms, applied before this element animates in. */
  @Input() hfReveal: number | string = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      node.classList.add('hf-revealed');
      return;
    }

    const delay = Number(this.hfReveal) || 0;
    node.style.transitionDelay = `${delay}ms`;
    node.classList.add('hf-reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          node.classList.add('hf-revealed');
          // One-shot: re-animating on every scroll past is distracting.
          this.observer?.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
