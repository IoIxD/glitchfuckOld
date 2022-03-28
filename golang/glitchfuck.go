package glitchfuck

import (
	"log"
	"fmt"
	"strconv"
	"image"
	"image/color"
	"image/png"
	"os"
	"time"
)

func main() {
	// If too little arguments are supplied, explain the usage of the progream
	if(len(os.Args[1:]) <= 1) {
		fmt.Println(os.Args[0]+" <link to first image> <link to second image> <the output image (default: output-[time].png)>")
	} else {
		// The base images.
		img1, err := os.Open(os.Args[1]);
		if(err != nil) {log.Fatal(err);}
		img2, err := os.Open(os.Args[2]);
		if(err != nil) {log.Fatal(err);}
		defer img1.Close();
		defer img2.Close();
		// The decoded images
		img1_, err := png.Decode(img1);
		if(err != nil) {log.Fatal(err);}
		img2_, err := png.Decode(img2);
		if(err != nil) {log.Fatal(err);}
		// The final result
		imgf := image.NewNRGBA(image.Rect(0, 0, img1_.Bounds().Max.X, img1_.Bounds().Max.Y));
		// For each column in the image
		for y := img1_.Bounds().Min.Y; y < img1_.Bounds().Max.Y; y++ {
			// and each row
			for x := img1_.Bounds().Min.X; x < img1_.Bounds().Max.X; x++ {
				// Get the colors of each pixel in both images
				c1_r, c1_g, c1_b, _ := img1_.At(x, y).RGBA() 
				c2_r, c2_g, c2_b, _ := img2_.At(x, y).RGBA() 
				// Then set the corresponding pixel in the final image to a xor'd version of the pixels.
				imgf.Set(x,y, color.NRGBA{
					R: uint8(c1_r ^ c2_r),
					G: uint8(c1_g ^ c2_g),
					B: uint8(c1_b ^ c2_b),
					A: 255,
				})
			}
		}
		// After all is finished, write the image to the local directory, with a file name based on the third argument (or just something with the unix time in it)
		out := ""
		if(len(os.Args[1:]) >= 3) {
			out = os.Args[3]
		} else {
			out = "result-"+strconv.Itoa(int(time.Now().Unix()))+".png";
		}
		f, _ := os.Create(out);
		if err := png.Encode(f, imgf); err != nil {
			f.Close()
			log.Fatal(err);
		}
	}
	
}