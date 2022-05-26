import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AboutPeopleComponent } from "./about-people/about-people.component";
import { AboutRefsComponent } from "./about-refs/about-refs.component";
import { FreetextComponent } from "./freetext/freetext.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "texto-livre", component: FreetextComponent },
  { path: "sobre/equipa", component: AboutPeopleComponent },
  { path: "sobre/referencias", component: AboutRefsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
