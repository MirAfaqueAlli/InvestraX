import React from 'react';
function Universe() {
    return ( <>
    <div className="container">
        <div className="row text-center">
            <h1>The Zerodha Universe</h1>
            <p>Extend your trading and investment experience even further with our partner platforms</p>

            <div className="col-4 p-3 mt-5">
                <img src="media/images/smallcaseLogo.png" alt="" />
                <p className="text-small text-muted">Thematic investing platform
that helps you invest in diversified
baskets of stocks on ETFs.</p>
            </div>
            <div className="col-4 p-3 mt-5">
                <img src="media/images/streakLogo.png" alt="" style={{width: "38%"}}/>
                <p className="text-small text-muted">Systematic trading platform
that allows you to create and backtest
strategies without coding.</p>
            </div>
            <div className="col-4 p-3 mt-5">
                <img src="media/images/sensibullLogo.svg" alt=""  style={{width: "38%"}} className='mt-2'/>
                <p className="text-small text-muted mt-3">Options trading platform that lets you
create strategies, analyze positions, and examine
data points like open interest, FII/DII, and more.
</p>
            </div>
            <div className="col-4 p-3 mt-5">
                <img src="media/images/zerodhaFundhouse.png" alt="" style={{width: "38%"}} className='mb-3'/>
                <p className="text-small text-muted">Our asset management venture
that is creating simple and transparent index
funds to help you save for your goals.
</p>
            </div>
            <div className="col-4 p-3 mt-5">
                <img src="media/images/goldenpiLogo.png" alt="" className='mb-3'/>
                <p className="text-small text-muted">Investment research platform
that offers detailed insights on stocks,
sectors, supply chains, and more.</p>
            </div>
            <div className="col-4 p-3 mt-5">
                <img src="media/images/dittoLogo.png" alt="" style={{width: "26%"}} className='mb-3'/>
                <p className="text-small text-muted">Personalized advice on life
and health insurance. No spam
and no mis-selling.</p>
            </div>
             <button className='p-2 btn btn-primary fs-5 mb-5' style={{width: "20%", margin: "0 auto"}}>Signup Now</button>
        </div>
    </div>
    </> );
}

export default Universe;