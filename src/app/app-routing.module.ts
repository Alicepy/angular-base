import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';

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
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
