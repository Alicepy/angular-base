import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { OverlayComponent } from './pages/overlay/overlay';
import { VectorComponent } from './pages/vector/vector';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'header',
    component: HeaderComponent
  },
  {
    path: 'overlay',
    component: OverlayComponent
  },
  {
    path: 'vector',
    component: VectorComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
