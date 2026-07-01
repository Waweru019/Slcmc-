import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


interface MediaAsset {
  id: number;
  title: string;
  alt_text: string;
  image_path: string;
}



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})


export class Home implements OnInit, OnDestroy {


  private http = inject(HttpClient);

  private apiEndpoint = 'http://192.168.0.115:8080/admin.php';



  sliderImages = signal<MediaAsset[]>([]);

  currentSlide = signal<number>(0);



  private autoPlayTimer: any;



  ngOnInit() {

    this.fetchSliderImages();

  }




  fetchSliderImages() {


    this.http.get<any>(`${this.apiEndpoint}?action=getMediaAssets`)

    .subscribe({

      next: (res) => {


        if(res.status === 'success' && res.data.length > 0){


          this.sliderImages.set(res.data);


          this.startAutoPlay();


        }


      },


      error:(err)=>{

        console.error("Media loading failed:",err);

      }


    });


  }





  // changes image after seconds

  startAutoPlay(){


    if(this.autoPlayTimer){

      clearInterval(this.autoPlayTimer);

    }



    this.autoPlayTimer = setInterval(()=>{


      this.currentSlide.update(index => {


        if(index >= this.sliderImages().length - 1){

          return 0;

        }


        return index + 1;


      });



    },5000);



  }





  ngOnDestroy(){


    if(this.autoPlayTimer){

      clearInterval(this.autoPlayTimer);

    }


  }



}