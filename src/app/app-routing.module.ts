import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { FreetextComponent } from "./freetext/freetext.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "texto-livre", component: FreetextComponent },
  { path: "sobre", component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
