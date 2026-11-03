import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnDestroy {
  /**
   * Below this width the sidenav becomes an overlay drawer. Pinned open, it
   * ate the whole viewport on a phone and squeezed the page into a column a
   * few characters wide.
   */
  isHandset = false;
  drawerOpen = false;

  private subs = new Subscription();

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router,
    breakpoints: BreakpointObserver
  ) {
    this.subs.add(
      breakpoints.observe('(max-width: 900px)').subscribe(({ matches }) => {
        this.isHandset = matches;
        // On desktop the drawer is always open; on handset it starts closed.
        this.drawerOpen = !matches;
      })
    );

    // A drawer that stays open over the page it just navigated to hides the
    // result the user asked for.
    this.subs.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          if (this.isHandset) this.drawerOpen = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}
