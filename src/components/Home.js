import React, { useState } from 'react'
import './home.css'
import CarouselComp from './Carousel/CarouselComp';
import { useRecordWebcam } from 'react-record-webcam'
export default function Home() {
	const [playing, setPlaying] = useState(false);
	const recordWebcam = useRecordWebcam();

	const url = 'http://127.0.0.1:5000/api/upload';

	const WIDTH = 388;
	const HEIGHT = 290

	const handleDate = (date) => {
        const stringDate = date.toString();

        const year = stringDate.slice(0, 2)
		let y = '19';
		if(year > 30) {
			y+=year
		}else if(year < 30){
			y = '20' + year;
		}else{
			y=''
		}

        const m = stringDate.slice(2, 4)
        const d = stringDate.slice(4, 6)
        return (`${d}/${m}/${y}`);
    }

	const handleProblem = (passProblem) => {

        if (passProblem === '0') {
            return 'Not Found'
        } else if (passProblem === '1') {
            return "Invalid date of birth"
        } else if (passProblem === '2') {
            return "Passport has Expired"
        } else if (passProblem === '3') {
            return "Invalid date of birth and Passport has Expired"
        } else if (passProblem === '4') {
            return "Invalid passport number"
        } else if (passProblem === '6') {
            return "Passport has Expired and Invalid passport number"
        }else {
            return "Passport has Expired, Invalid passport number and Invalid passport number"
        }

    }

	////////////////////////////// handle video cam 


	const handleOpen = () => {
		setPlaying(true);
		recordWebcam.open();
	}


	const handleContent = (data) => {
		let myData = document.querySelector('#my_card_data')
		let content = `
		
			<ul className="m-4">
				<li>Name: ${data.Name} ${data.Surname}</li>
				<li>Number: ${data.Number}</li>
				<li>Gender: ${data.Sex === 'M' ? 'Male' : 'Female' }</li>
				<li>Date of Birth: ${handleDate(data.DateOfBirth)}</li>
				<li>Expiration date: ${handleDate(data.ExpirationDate)}</li>
				<li>Country: ${data.Country}</li>
				<li>Problem: ${handleProblem(data.Problem)}</li>
			</ul>
		`;

		myData.appendChild(content);

	}

	const handleSpinner = () => {
		let myData = document.querySelector('#my_card_data')
				myData.innerHTML = `
				<div class="text-center mx-auto">
				<div class="spinner-border  text-primary" role="status">
				<span class="sr-only">Loading...</span>
			  </div>
				</div>
			    `
			}
			const handleStart = async () => {
				recordWebcam.start();
				handleSpinner();
				// handleSpinner();
				await setTimeout(()=>{
					recordWebcam.stop();
					setTimeout(()=> {
						const blob = recordWebcam.getRecording();
						let myData = document.querySelector('#my_card_data')

						blob.then(data =>{
							const form = new FormData()
							form.append('file', data)
							// now upload it
							fetch(url, {
								method: 'POST',
								body: form
							})
							.then(res => {
								if(!res.ok){
									throw new Error(res.status);
								}

								return res.json()
								
							})
							.then(data=>{
								handleContent(data);
								// setData(data)
							}).catch(err=>{
								myData.innerHTML = `${err.message = 403 ? "Couldn't Recognize Passport" : 'this passport is already exists'}`
								myData.style.color = 'red'
								myData.style.textAlign = 'center'
							}
							)

						})

						recordWebcam.open();
					},1000)
				}, 5000)
				
	}

	const handleStop = () => {
		setPlaying(false);
		let myData = document.querySelector('#my_card_data')
		myData.innerHTML = ''
		recordWebcam.close();
	}

	return (
		<div className=''>
			<CarouselComp />
			<div className="container mt-4">
			{/* <RecordVideo /> */}
				<div className="">

					<h3 className='my-color text-center my-font font-weight-bold '>Let's try...</h3>
					<div className=" mx-auto ">
						<div className="mx-auto my-3 ">


							<p className="text-center lead my-font">Click on play icon to open the camera.</p>
							<div className='mx-auto text-center'>
								<video
									id='video'
									ref={recordWebcam.webcamRef}
									height={HEIGHT}
									width={WIDTH}
									muted
									autoPlay
									className="video mb-3"
								></video> <br />

									{
										playing ? ( <>
											<button className="btn btn-primary mx-2" id='' onClick={handleStart} ><i className="fas fa-video"></i></button>
											<button className="btn btn-secondary mx-2" id='' onClick={handleStop} ><i class="fas fa-pause"></i></button>
											</>
										) : (
											<button className="btn btn-primary" onClick={handleOpen}><i className="fas fa-play"></i></button>
										)
									}
								
							</div>

						</div>
					</div>
					<div>
					<div className="container mx-auto my-3 " id='my_data'>				
						<div className="mx-auto border border-2 p-4 w-50" id="my_card_data">
						</div>
					</div>
				</div>
			</div>
		</div>	
		</div>	
	)
}
