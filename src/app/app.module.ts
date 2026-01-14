import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadingScreenComponent } from './shared/components/loading-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LoadingScreenComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
