import { Component, OnInit, signal, inject ,ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api';
import jsPDF from 'jspdf';
export interface UserProfileResponses {
  status: string;
  user: any;
  academic: any;
  current: any;
  history: any[];
  education: any;
  membership: any;
  social: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dasboard.html',
  standalone: true,
  imports: [CommonModule] // Cleaned up HttpClientModule since it's handled by the service
})
export class Dashboard implements OnInit {
  private apiService = inject(ApiService);
  userProfile = signal<UserProfileResponses | null>(null);
  @ViewChild('profileCard', { static: false }) profileCard!: ElementRef;
 
  ngOnInit() {
    const userId = Number(localStorage.getItem('userId')) || 0;
    
    if (userId > 0) {
      this.getUserProfile(userId);
    } else {
      console.warn("Dashboard loaded but no valid userId was found in localStorage.");
    }
  }

  getUserProfile(userId: number) {
    this.apiService.getDashboardProfile(userId).subscribe({
      next: (data) => {
        console.log("Dashboard profile data loaded:", data);
        this.userProfile.set(data);
      },
      error: (err) => {
        console.error("Failed to load dashboard statistics:", err);
      }
    });
  }
  async downloadCV() {

  const profile = this.userProfile();
  if (!profile) return;


  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });


  const pageWidth = 210;
  const pageHeight = 297;


  const sidebarWidth = 65;
  const margin = 10;
  const rightX = sidebarWidth + 12;



  // COLORS
  const navy:[number,number,number] = [30,41,59];
  const white:[number,number,number] = [255,255,255];
  const light:[number,number,number] = [226,232,240];
  const blue:[number,number,number] = [37,99,235];



  // =========================
  // CIRCLE IMAGE CONVERTER
  // =========================

  const makeCircularImage = (base64:string):Promise<string>=>{

    return new Promise(resolve=>{

      const img = new Image();


      img.onload = ()=>{


        const size = 300;

        const canvas = document.createElement("canvas");

        canvas.width = size;
        canvas.height = size;


        const ctx = canvas.getContext("2d")!;



        ctx.beginPath();

        ctx.arc(
          size/2,
          size/2,
          size/2,
          0,
          Math.PI*2
        );


        ctx.closePath();

        ctx.clip();



        ctx.drawImage(
          img,
          0,
          0,
          size,
          size
        );



        resolve(
          canvas.toDataURL("image/png")
        );

      };


      img.src = base64;


    });

  };






  // =========================
  // LEFT SIDEBAR
  // =========================


  pdf.setFillColor(...navy);

  pdf.rect(
    0,
    0,
    sidebarWidth,
    pageHeight,
    "F"
  );



  let leftY = 18;



  // PROFILE PHOTO

  if(profile.user?.photo_base64){

    const circlePhoto =
      await makeCircularImage(
        profile.user.photo_base64
      );



    pdf.addImage(
      circlePhoto,
      "PNG",
      sidebarWidth/2-16,
      leftY,
      32,
      32
    );


    leftY += 45;

  }




  function sidebarTitle(title:string){


    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(11);

    pdf.setTextColor(...white);


    pdf.text(
      title,
      margin,
      leftY
    );


    leftY += 3;



    pdf.setDrawColor(
      148,
      163,
      184
    );


    pdf.setLineWidth(.3);


    pdf.line(
      margin,
      leftY,
      sidebarWidth-margin,
      leftY
    );


    leftY += 8;


  }




  function sidebarText(text:string){


    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setFontSize(9);


    pdf.setTextColor(...light);


    const lines =
      pdf.splitTextToSize(
        text,
        sidebarWidth-18
      );



    pdf.text(
      lines,
      margin,
      leftY
    );


    leftY += lines.length*4;

  }







  // CONTACT

  sidebarTitle("CONTACT");


  sidebarText(
    `Phone: ${profile.user?.Phone_number || "N/A"}`
  );


  sidebarText(
    `Email: ${profile.user?.Email || "N/A"}`
  );



  if(profile.social?.linkedin){

    sidebarText(
      `LinkedIn: ${profile.social.linkedin}`
    );

  }







  // METRICS


  leftY += 8;


  sidebarTitle("METRICS");



  sidebarText(
    `Gender: ${profile.user?.Gender || "N/A"}`
  );


  sidebarText(
    `County: ${profile.social?.home_county || "N/A"}`
  );







  // EDUCATION


  leftY += 8;


  sidebarTitle("EDUCATION");



  pdf.setFont(
    "helvetica",
    "bold"
  );


  pdf.setFontSize(9);


  pdf.setTextColor(
    45,
    212,
    191
  );



  const course =
    profile.academic?.programme_name ||
    "N/A";



  pdf.text(
    course,
    margin,
    leftY
  );



  leftY += 7;



  sidebarText(
    `Cohort: ${profile.academic?.cohort_name || "N/A"}`
  );


  sidebarText(
    `Graduation Year: ${profile.academic?.graduation_year || "N/A"}`
  );








  // =========================
  // RIGHT CONTENT
  // =========================


  let y = 25;



  pdf.setFont(
    "helvetica",
    "bold"
  );


  pdf.setFontSize(24);


  pdf.setTextColor(...navy);



  pdf.text(
    profile.user?.First_name || "ALUMNI",
    rightX,
    y
  );




  y += 9;



  pdf.setFontSize(12);


  pdf.setTextColor(...blue);



  pdf.text(
    (
      profile.current?.role ||
      "PROFESSIONAL ALUMNI"
    ).toUpperCase(),
    rightX,
    y
  );




  // tiny line instead of thick bar

  y += 6;


  pdf.setLineWidth(.5);


  pdf.setDrawColor(...blue);


  pdf.line(
    rightX,
    y,
    rightX+15,
    y
  );









  function section(title:string){


    y += 15;


    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(12);


    pdf.setTextColor(...navy);



    pdf.text(
      title,
      rightX,
      y
    );



    y += 3;



    pdf.setLineWidth(.3);


    pdf.setDrawColor(
      200,
      200,
      200
    );



    pdf.line(
      rightX,
      y,
      pageWidth-12,
      y
    );


    y += 7;


  }






  // CURRENT


  section(
    "CURRENT ENGAGEMENT"
  );



  pdf.setFontSize(10);


  pdf.setTextColor(...navy);



  pdf.text(
    `Role: ${profile.current?.role || "N/A"}`,
    rightX,
    y
  );


  y+=6;



  pdf.setTextColor(...blue);


  pdf.text(
    `Placed At: ${profile.current?.employer_name || "N/A"}`,
    rightX,
    y
  );


  y+=6;



  pdf.setTextColor(
    100,
    116,
    139
  );



  pdf.text(
    `Start Date: ${
      profile.current?.start_date
      ?
      new Date(profile.current.start_date)
      .toLocaleDateString()
      :
      "N/A"
    }`,
    rightX,
    y
  );






  // EXPERIENCE


  section(
    "WORK EXPERIENCE HISTORY"
  );




  profile.history?.forEach((item:any)=>{


    pdf.setFillColor(...blue);


    pdf.circle(
      rightX+2,
      y,
      1.5,
      "F"
    );



    pdf.setFont(
      "helvetica",
      "bold"
    );


    pdf.setFontSize(10);



    pdf.setTextColor(...navy);



    pdf.text(
      item.role || "Position",
      rightX+8,
      y
    );



    y+=5;



    pdf.setTextColor(...blue);



    pdf.text(
      item.employer_name || "Company",
      rightX+8,
      y
    );



    y+=5;



    pdf.setFont(
      "helvetica",
      "normal"
    );


    pdf.setTextColor(
      100,
      116,
      139
    );


    pdf.text(
      `${item.from_date || ""} - ${item.to_date || "Present"}`,
      rightX+8,
      y
    );



    y+=15;



  });







  pdf.save(
    `${profile.user?.First_name || "Alumni"}_CV.pdf`
  );

}
}