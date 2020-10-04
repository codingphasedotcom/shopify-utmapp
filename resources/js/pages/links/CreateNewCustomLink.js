import React, {useState} from 'react';
import {TitleBar, useRoutePropagation, ResourcePicker} from '@shopify/app-bridge-react';
import {useLocation, useHistory} from 'react-router-dom';
import axios from 'axios';

export default function CreateNewLink(props){
    let location = useLocation();
    // console.log(location)
    useRoutePropagation(location);
    const history = useHistory();

    const [resourcePickerOpen, setResourcePickerOpen] = useState(true);
    const [customData, setCustomData] = useState(false);
    const [formText, setFormText] = useState({
        customTitle: '',
        customUrl: '',
        campaignSource: '',
        campaignMedium: '',
        campaignName: '',
        campaignTerm: '',
        campaignContent: ''
    });

    const slugify = text => 
    text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')


    function handleText(name, text){
        let newState = {
            [name]: text
        }
        setFormText({
            ...formText,
            ...newState
        })
        console.log(formText)
    }
    function clickedSaveBtn(){
        axios.post('/api/createlink', {
            campaign_source: formText.campaignSource,
            campaign_medium: formText.campaignMedium,
            campaign_name: formText.campaignName,
            campaign_term: formText.campaignTerm,
            campaign_content: formText.campaignContent,
            discount_code: formText.discountCode,
            original_content_url: formText.customUrl,
            original_content_title: formText.customTitle,
            link_type: 'custom',
            user_id: document.getElementById("userId").value
          })
          .then(function (response) {
              if(response.data == "Saved Data"){
                  alert('Link Saved')
                  history.push('/app')
              }
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    return(<>
        <TitleBar title="Create New Custom Link" />
        
        <div className={"app-page-title"}>
            <div className="page-title-wrapper">
                <div className="page-title-heading">
                    <div className="page-title-icon">
                        <i className="pe-7s-display1 icon-gradient bg-premium-dark">
                        </i>
                    </div>
                    <div>Create A New Custom Link
                        <div className="page-title-subheading">
                            Create a new custom link
                        </div>
                    </div>
                </div>
                <div className="page-title-actions">
                    
                    <div className="d-inline-block dropdown">
                        <button onClick={clickedSaveBtn} type="button" className="btn-shadow btn btn-info">
                            <span className="btn-icon-wrapper pr-2 opacity-7">
                                <i className="fa fa-business-time fa-w-20"></i>
                            </span>
                            Save
                        </button>
                        
                    </div>
                </div>    
            </div>
        </div>  
        <Content customData={customData} formText={formText} handleText={handleText} />

        
        
    </>)
}

function Content(props) {
    return (<>
        <div className={"row"}>
            <div className="col-md-6">
                <div className="main-card mb-3 card">
                    <div className="card-body">
                        <h5 className="card-title">Controls Types</h5>
                        <form>
                        <div className="position-relative form-group">
                            <label htmlFor="customUrl">Link Title</label>
                            <input onChange={(event) => props.handleText('customTitle', event.target.value)} name="customTitle" id="customTitle" placeholder="custom title" type="text" className="form-control" value={props.formText.customTitle}/>
                        </div>
                        <div className="position-relative form-group">
                            <label htmlFor="customUrl">Custom URL</label>
                            <input onChange={(event) => props.handleText('customUrl', event.target.value)} name="customUrl" id="customUrl" placeholder="custom URL" type="text" className="form-control" value={props.formText.customUrl}/>
                        </div>
                        
                        <div className="position-relative form-group">
                            <label htmlFor="campaignSource">Campaign Source</label>
                            <input onChange={(event) => props.handleText('campaignSource', event.target.value)} name="campaignSource" id="campaignSource" placeholder="Google, Youtube, Instagram" type="text" className="form-control" value={props.formText.campaignSource} />
                        </div>
                        <div className="position-relative form-group">
                            <label htmlFor="campaignMedium">Campaign Medium</label>
                            <input onChange={(event) => props.handleText('campaignMedium', event.target.value)} name="campaignMedium" id="campaignMedium" placeholder="CPC, Banner, Instagram Profile Link" type="text" className="form-control" value={props.formText.campaignMedium} />
                        </div>
                        <div className="position-relative form-group">
                            <label htmlFor="campaignName">Campaign Name</label>
                            <input onChange={(event) => props.handleText('campaignName', event.target.value)}  name="campaignName" id="campaignName" placeholder="50July42020, Labor Day 2020, COUPON234KID" type="text" className="form-control" value={props.formText.campaignName}/>
                        </div>
                        <div className="position-relative form-group">
                            <label htmlFor="campaignTerm">Campaign Term (Optional)</label>
                            <input onChange={(event) => props.handleText('campaignTerm', event.target.value)}  name="campaignTerm" id="campaignTerm" placeholder="Add Paid Keywords" type="text" className="form-control" value={props.formText.campaignTerm} />
                        </div>
                        <div className="position-relative form-group">
                            <label htmlFor="campaignContent">Campaign Content</label>
                            <input onChange={(event) => props.handleText('campaignContent', event.target.value)} name="campaignContent" id="campaignContent" placeholder="Girl With Laptop Image Ad, Image3, Banner 5" type="text" className="form-control" value={props.formText.campaignContent} />
                        </div>
                        
                        <button className="mt-1 btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="main-card mb-3 card">
                    <div className="card-body">
                        <h5 className="card-title">custom</h5>
                        <div className="row mb-3">
                            
                            <div className="col-md-8 d-flex align-items-center">
                                <h2>{props.customData.title}</h2>
                            </div>
                        </div>
                        <h5 className="card-title">Link Preview</h5>
                        <div className="position-relative form-group">
                        {`${props.formText.customUrl}?${props.formText.campaignSource == '' ? '' : `utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </>)
}