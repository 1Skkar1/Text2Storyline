import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { DatePipe } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
//import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
//import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
//import { MatSnackBarModule} from "@angular/material/snack-bar";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
//import { MatLegacyPaginatorModule as MatPaginatorModule } from "@angular/material/legacy-paginator";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatLegacySliderModule as MatSliderModule } from "@angular/material/legacy-slider";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
//import { MatLegacyProgressBarModule as MatProgressBarModule } from "@angular/material/legacy-progress-bar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
//import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
//import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatExpansionModule } from '@angular/material/expansion';

//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { SafePipe } from "./safe.pipe";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FreetextComponent } from './freetext/freetext.component';
import { NarrativeComponent } from './narrative/narrative.component';
import { StorylineComponent } from './storyline/storyline.component';
import { AnnotatedtextComponent } from './annotatedtext/annotatedtext.component';
import { EntitiesComponent } from './entities/entities.component';
import { WordcloudComponent } from './wordcloud/wordcloud.component';
import { VideoComponent } from './video/video.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NarrativeComponent,
    EntitiesComponent,
    AnnotatedtextComponent,
    FreetextComponent,
    WordcloudComponent,
    StorylineComponent,
    VideoComponent,
    AboutComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    HttpClientModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    //MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSliderModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule
    //NgbModule
  ],
  providers: [DatePipe, HomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
