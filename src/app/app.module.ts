import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSliderModule } from "@angular/material/slider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DatePipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { SafePipe } from "./safe.pipe";
import { MatSortModule } from "@angular/material/sort";

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { DocsQueryComponent } from './docsquery/docsquery.component';
import { QueryComponent } from './query/query.component';
import { FrameComponent } from './frame/frame.component';
import { AboutPeopleComponent } from './about-people/about-people.component';
import { AboutRefsComponent } from './about-refs/about-refs.component';
import { FreetextComponent } from './freetext/freetext.component';
import { WordcloudComponent } from './wordcloud/wordcloud.component';
import { StorylineComponent } from './storyline/storyline.component';
import { AgentDetectionComponent } from './agent-detection/agent-detection.component';
import { ResultsComponent } from './results/results.component';
import { VideoComponent } from './video/video.component';

@NgModule({
  declarations: [
    SafePipe,
    AppComponent,
    HomeComponent,
    DocsQueryComponent,
    QueryComponent,
    FrameComponent,
    AboutPeopleComponent,
    AboutRefsComponent,
    FreetextComponent,
    WordcloudComponent,
    StorylineComponent,
    AgentDetectionComponent,
    ResultsComponent,
    VideoComponent,
  ],
    imports: [
        NgxEchartsModule.forRoot({echarts}),
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        AppRoutingModule,
        LayoutModule,
        MatToolbarModule,
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
        MatSelectModule,
        MatInputModule,
        MatStepperModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatSliderModule,
        MatDialogModule,
        MatTooltipModule,
        NgbModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
    ],
  providers: [DatePipe, DocsQueryComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
