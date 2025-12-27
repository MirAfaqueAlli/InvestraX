import React from 'react';
function HeroSection() {
    return ( <>
    <div style={{backgroundColor:"RGB(250, 250, 250"}}>
        <div className="container p-5" >
        <div className="row">
            <div className="col">
                <h1 className='fs-1 align-items-start'>Support Portal</h1>
            </div>
            <div className="col d-flex justify-content-end">
                <button className='p-2 btn btn-primary fs-5 mb-5 ' style={{width: "20%"}}>My tickets</button>
            
            </div>
            <div class="input-group input-group-lg">
  <span class="input-group-text" id="inputGroup-sizing-lg"><i class="fa-solid fa-magnifying-glass"></i></span>
  <input style={{padding:"1rem"}} type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" placeholder='Eg: How do I open my account, How do I activate F&O...'/>
</div>
        </div>
    </div>
    </div>
    </> );
}

export default HeroSection;