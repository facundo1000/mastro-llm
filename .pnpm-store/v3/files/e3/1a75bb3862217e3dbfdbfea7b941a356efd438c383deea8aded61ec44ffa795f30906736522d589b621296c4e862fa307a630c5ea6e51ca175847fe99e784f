import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, inject, Injector, Input, runInInjectionContext, } from '@angular/core';
import { injectNgIconConfig } from '../../providers/icon-config.provider';
import { injectNgIconLoader, injectNgIconLoaderCache, } from '../../providers/icon-loader.provider';
import { injectNgIcons } from '../../providers/icon.provider';
import { coerceLoaderResult } from '../../utils/async';
import { coerceCssPixelValue } from '../../utils/coercion';
import { toPropertyName } from '../../utils/format';
import * as i0 from "@angular/core";
export class NgIcon {
    constructor() {
        /** Access the global icon config */
        this.config = injectNgIconConfig();
        /** Access the icons */
        this.icons = injectNgIcons();
        /** Access the icon loader if defined */
        this.loader = injectNgIconLoader();
        /** Access the icon cache if defined */
        this.cache = injectNgIconLoaderCache();
        /** Access the injector */
        this.injector = inject(Injector);
        /** Access the element ref */
        this.elementRef = inject(ElementRef);
        /** Define the size of the icon */
        this.size = this.config.size;
        /** Define the color of the icon */
        this.color = this.config.color;
    }
    /** Define the name of the icon to display */
    set name(name) {
        this.setIcon(name);
    }
    /** Define the svg of the icon to display */
    set svg(svg) {
        this.elementRef.nativeElement.innerHTML = svg;
    }
    /**
     * Load the icon with the given name and insert it into the template.
     * @param name The name of the icon to load.
     */
    async setIcon(name) {
        const propertyName = toPropertyName(name);
        for (const icons of [...this.icons].reverse()) {
            if (icons[propertyName]) {
                // insert the SVG into the template
                this.elementRef.nativeElement.innerHTML = icons[propertyName];
                return;
            }
        }
        // if there is a loader defined, use it to load the icon
        if (this.loader) {
            const result = await this.requestIconFromLoader(name);
            // if the result is a string, insert the SVG into the template
            if (result !== null) {
                this.elementRef.nativeElement.innerHTML = result;
                return;
            }
        }
        // if there is no icon with this name warn the user as they probably forgot to import it
        console.warn(`No icon named ${name} was found. You may need to import it using the withIcons function.`);
    }
    /**
     * Request the icon from the loader.
     * @param name The name of the icon to load.
     * @returns The SVG content for a given icon name.
     */
    requestIconFromLoader(name) {
        return new Promise(resolve => {
            runInInjectionContext(this.injector, async () => {
                // if we have a cache, check if the icon is already loaded (i.e, it is a string)
                if (this.cache) {
                    const cachedResult = this.cache.get(name);
                    if (typeof cachedResult === 'string') {
                        resolve(cachedResult);
                        return;
                    }
                    // it may be a promise, so we need to await it
                    if (cachedResult instanceof Promise) {
                        const result = await cachedResult;
                        resolve(result);
                        return;
                    }
                }
                const promise = coerceLoaderResult(this.loader(name));
                // store the promise in the cache so if we get repeated calls (e.g. in a loop) before the loader has resolved
                // then don't call the loader function multiple times
                this.cache?.set(name, promise);
                // await the result of the promise
                const result = await promise;
                // if we have a cache, store the result
                this.cache?.set(name, result);
                resolve(result);
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgIcon, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.1.3", type: NgIcon, isStandalone: true, selector: "ng-icon", inputs: { name: "name", svg: "svg", size: ["size", "size", coerceCssPixelValue], strokeWidth: "strokeWidth", color: "color" }, host: { properties: { "style.--ng-icon__size": "this.size", "style.--ng-icon__stroke-width": "this.strokeWidth", "style.color": "this.color" } }, ngImport: i0, template: '', isInline: true, styles: [":host{display:inline-block;width:var(--ng-icon__size);height:var(--ng-icon__size);overflow:hidden}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgIcon, decorators: [{
            type: Component,
            args: [{ selector: 'ng-icon', template: '', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, styles: [":host{display:inline-block;width:var(--ng-icon__size);height:var(--ng-icon__size);overflow:hidden}\n"] }]
        }], propDecorators: { name: [{
                type: Input
            }], svg: [{
                type: Input
            }], size: [{
                type: HostBinding,
                args: ['style.--ng-icon__size']
            }, {
                type: Input,
                args: [{ transform: coerceCssPixelValue }]
            }], strokeWidth: [{
                type: HostBinding,
                args: ['style.--ng-icon__stroke-width']
            }, {
                type: Input
            }], color: [{
                type: HostBinding,
                args: ['style.color']
            }, {
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saWIvY29tcG9uZW50cy9pY29uL2ljb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixXQUFXLEVBQ1gsTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wscUJBQXFCLEdBQ3RCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzFFLE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsdUJBQXVCLEdBQ3hCLE1BQU0sc0NBQXNDLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7QUFhcEQsTUFBTSxPQUFPLE1BQU07SUFQbkI7UUFRRSxvQ0FBb0M7UUFDbkIsV0FBTSxHQUFHLGtCQUFrQixFQUFFLENBQUM7UUFFL0MsdUJBQXVCO1FBQ04sVUFBSyxHQUFHLGFBQWEsRUFBRSxDQUFDO1FBRXpDLHdDQUF3QztRQUN2QixXQUFNLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztRQUUvQyx1Q0FBdUM7UUFDdEIsVUFBSyxHQUFHLHVCQUF1QixFQUFFLENBQUM7UUFFbkQsMEJBQTBCO1FBQ1QsYUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3Qyw2QkFBNkI7UUFDWixlQUFVLEdBQUcsTUFBTSxDQUEwQixVQUFVLENBQUMsQ0FBQztRQVkxRSxrQ0FBa0M7UUFHbEMs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Q0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzhHQXBIVSxNQUFNO2tHQUFOLE1BQU0sc0dBK0JHLG1CQUFtQiwyTkFwQzdCLEVBQUU7OzJGQUtELE1BQU07a0JBUGxCLFNBQVM7K0JBQ0UsU0FBUyxZQUNULEVBQUUsY0FDQSxJQUFJLG1CQUVDLHVCQUF1QixDQUFDLE1BQU07OEJBc0JsQyxJQUFJO3NCQUFoQixLQUFLO2dCQUtPLEdBQUc7c0JBQWYsS0FBSztnQkFPTixJQUFJO3NCQUZILFdBQVc7dUJBQUMsdUJBQXVCOztzQkFDbkMsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxtQkFBbUIsRUFBRTtnQkFNekMsV0FBVztzQkFGVixXQUFXO3VCQUFDLCtCQUErQjs7c0JBQzNDLEtBQUs7Z0JBTU4sS0FBSztzQkFGSixXQUFXO3VCQUFDLGFBQWE7O3NCQUN6QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIGluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBydW5JbkluamVjdGlvbkNvbnRleHQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHR5cGUgeyBJY29uTmFtZSB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvaWNvbi9pY29uLW5hbWUnO1xuaW1wb3J0IHsgaW5qZWN0TmdJY29uQ29uZmlnIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL2ljb24tY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7XG4gIGluamVjdE5nSWNvbkxvYWRlcixcbiAgaW5qZWN0TmdJY29uTG9hZGVyQ2FjaGUsXG59IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9pY29uLWxvYWRlci5wcm92aWRlcic7XG5pbXBvcnQgeyBpbmplY3ROZ0ljb25zIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL2ljb24ucHJvdmlkZXInO1xuaW1wb3J0IHsgY29lcmNlTG9hZGVyUmVzdWx0IH0gZnJvbSAnLi4vLi4vdXRpbHMvYXN5bmMnO1xuaW1wb3J0IHsgY29lcmNlQ3NzUGl4ZWxWYWx1ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvZXJjaW9uJztcbmltcG9ydCB7IHRvUHJvcGVydHlOYW1lIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9ybWF0JztcblxuLy8gVGhpcyBpcyBhIHR5cGVzY3JpcHQgdHlwZSB0byBwcmV2ZW50IGluZmVyZW5jZSBmcm9tIGNvbGxhcHNpbmcgdGhlIHVuaW9uIHR5cGUgdG8gYSBzdHJpbmcgdG8gaW1wcm92ZSB0eXBlIHNhZmV0eVxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbmV4cG9ydCB0eXBlIEljb25UeXBlID0gSWNvbk5hbWUgfCAoc3RyaW5nICYge30pO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy1pY29uJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBzdHlsZVVybHM6IFsnLi9pY29uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBOZ0ljb24ge1xuICAvKiogQWNjZXNzIHRoZSBnbG9iYWwgaWNvbiBjb25maWcgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBjb25maWcgPSBpbmplY3ROZ0ljb25Db25maWcoKTtcblxuICAvKiogQWNjZXNzIHRoZSBpY29ucyAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGljb25zID0gaW5qZWN0TmdJY29ucygpO1xuXG4gIC8qKiBBY2Nlc3MgdGhlIGljb24gbG9hZGVyIGlmIGRlZmluZWQgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBsb2FkZXIgPSBpbmplY3ROZ0ljb25Mb2FkZXIoKTtcblxuICAvKiogQWNjZXNzIHRoZSBpY29uIGNhY2hlIGlmIGRlZmluZWQgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBjYWNoZSA9IGluamVjdE5nSWNvbkxvYWRlckNhY2hlKCk7XG5cbiAgLyoqIEFjY2VzcyB0aGUgaW5qZWN0b3IgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBpbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cbiAgLyoqIEFjY2VzcyB0aGUgZWxlbWVudCByZWYgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmID0gaW5qZWN0PEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+PihFbGVtZW50UmVmKTtcblxuICAvKiogRGVmaW5lIHRoZSBuYW1lIG9mIHRoZSBpY29uIHRvIGRpc3BsYXkgKi9cbiAgQElucHV0KCkgc2V0IG5hbWUobmFtZTogSWNvblR5cGUpIHtcbiAgICB0aGlzLnNldEljb24obmFtZSk7XG4gIH1cblxuICAvKiogRGVmaW5lIHRoZSBzdmcgb2YgdGhlIGljb24gdG8gZGlzcGxheSAqL1xuICBASW5wdXQoKSBzZXQgc3ZnKHN2Zzogc3RyaW5nKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gc3ZnO1xuICB9XG5cbiAgLyoqIERlZmluZSB0aGUgc2l6ZSBvZiB0aGUgaWNvbiAqL1xuICBASG9zdEJpbmRpbmcoJ3N0eWxlLi0tbmctaWNvbl9fc2l6ZScpXG4gIEBJbnB1dCh7IHRyYW5zZm9ybTogY29lcmNlQ3NzUGl4ZWxWYWx1ZSB9KVxuICBzaXplPzogc3RyaW5nIHwgbnVtYmVyID0gdGhpcy5jb25maWcuc2l6ZTtcblxuICAvKiogRGVmaW5lIHRoZSBzdHJva2Utd2lkdGggb2YgdGhlIGljb24gKi9cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS4tLW5nLWljb25fX3N0cm9rZS13aWR0aCcpXG4gIEBJbnB1dCgpXG4gIHN0cm9rZVdpZHRoPzogc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBEZWZpbmUgdGhlIGNvbG9yIG9mIHRoZSBpY29uICovXG4gIEBIb3N0QmluZGluZygnc3R5bGUuY29sb3InKVxuICBASW5wdXQoKVxuICBjb2xvcj86IHN0cmluZyA9IHRoaXMuY29uZmlnLmNvbG9yO1xuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBpY29uIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIGluc2VydCBpdCBpbnRvIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIGljb24gdG8gbG9hZC5cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgc2V0SWNvbihuYW1lOiBJY29uVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IHRvUHJvcGVydHlOYW1lKG5hbWUpO1xuXG4gICAgZm9yIChjb25zdCBpY29ucyBvZiBbLi4udGhpcy5pY29uc10ucmV2ZXJzZSgpKSB7XG4gICAgICBpZiAoaWNvbnNbcHJvcGVydHlOYW1lXSkge1xuICAgICAgICAvLyBpbnNlcnQgdGhlIFNWRyBpbnRvIHRoZSB0ZW1wbGF0ZVxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSBpY29uc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlcmUgaXMgYSBsb2FkZXIgZGVmaW5lZCwgdXNlIGl0IHRvIGxvYWQgdGhlIGljb25cbiAgICBpZiAodGhpcy5sb2FkZXIpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucmVxdWVzdEljb25Gcm9tTG9hZGVyKG5hbWUpO1xuXG4gICAgICAvLyBpZiB0aGUgcmVzdWx0IGlzIGEgc3RyaW5nLCBpbnNlcnQgdGhlIFNWRyBpbnRvIHRoZSB0ZW1wbGF0ZVxuICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSByZXN1bHQ7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiB0aGVyZSBpcyBubyBpY29uIHdpdGggdGhpcyBuYW1lIHdhcm4gdGhlIHVzZXIgYXMgdGhleSBwcm9iYWJseSBmb3Jnb3QgdG8gaW1wb3J0IGl0XG4gICAgY29uc29sZS53YXJuKFxuICAgICAgYE5vIGljb24gbmFtZWQgJHtuYW1lfSB3YXMgZm91bmQuIFlvdSBtYXkgbmVlZCB0byBpbXBvcnQgaXQgdXNpbmcgdGhlIHdpdGhJY29ucyBmdW5jdGlvbi5gLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCB0aGUgaWNvbiBmcm9tIHRoZSBsb2FkZXIuXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBpY29uIHRvIGxvYWQuXG4gICAqIEByZXR1cm5zIFRoZSBTVkcgY29udGVudCBmb3IgYSBnaXZlbiBpY29uIG5hbWUuXG4gICAqL1xuICBwcml2YXRlIHJlcXVlc3RJY29uRnJvbUxvYWRlcihuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHJ1bkluSW5qZWN0aW9uQ29udGV4dCh0aGlzLmluamVjdG9yLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBjYWNoZSwgY2hlY2sgaWYgdGhlIGljb24gaXMgYWxyZWFkeSBsb2FkZWQgKGkuZSwgaXQgaXMgYSBzdHJpbmcpXG4gICAgICAgIGlmICh0aGlzLmNhY2hlKSB7XG4gICAgICAgICAgY29uc3QgY2FjaGVkUmVzdWx0ID0gdGhpcy5jYWNoZS5nZXQobmFtZSk7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGNhY2hlZFJlc3VsdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlc29sdmUoY2FjaGVkUmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpdCBtYXkgYmUgYSBwcm9taXNlLCBzbyB3ZSBuZWVkIHRvIGF3YWl0IGl0XG4gICAgICAgICAgaWYgKGNhY2hlZFJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhY2hlZFJlc3VsdDtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9taXNlID0gY29lcmNlTG9hZGVyUmVzdWx0KHRoaXMubG9hZGVyIShuYW1lKSk7XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIHByb21pc2UgaW4gdGhlIGNhY2hlIHNvIGlmIHdlIGdldCByZXBlYXRlZCBjYWxscyAoZS5nLiBpbiBhIGxvb3ApIGJlZm9yZSB0aGUgbG9hZGVyIGhhcyByZXNvbHZlZFxuICAgICAgICAvLyB0aGVuIGRvbid0IGNhbGwgdGhlIGxvYWRlciBmdW5jdGlvbiBtdWx0aXBsZSB0aW1lc1xuICAgICAgICB0aGlzLmNhY2hlPy5zZXQobmFtZSwgcHJvbWlzZSk7XG5cbiAgICAgICAgLy8gYXdhaXQgdGhlIHJlc3VsdCBvZiB0aGUgcHJvbWlzZVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9taXNlO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBjYWNoZSwgc3RvcmUgdGhlIHJlc3VsdFxuICAgICAgICB0aGlzLmNhY2hlPy5zZXQobmFtZSwgcmVzdWx0KTtcblxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19