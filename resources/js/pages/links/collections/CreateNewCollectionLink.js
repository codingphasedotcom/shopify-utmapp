import React, {useState} from 'react';
import {TitleBar, useRoutePropagation, ResourcePicker, Toast} from '@shopify/app-bridge-react';
import {useLocation, useHistory} from 'react-router-dom';
import axios from 'axios';

export default function CreateNewLink(props){
    let location = useLocation();
    // console.log(location)
    useRoutePropagation(location);
    const history = useHistory();

    const [resourcePickerOpen, setResourcePickerOpen] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [collectionData, setCollectionData] = useState(false);
    const [formText, setFormText] = useState({
        discountCode: '',
        campaignSource: '',
        campaignMedium: '',
        campaignName: '',
        campaignTerm: '',
        campaignContent: '',
        collectionUrl: ''
    });
    const domainUrl = `${collectionData.collectionUrl}`.match(/^(?:\/\/|[^\/]+)*/)[0];
    const slug = `${collectionData.collectionUrl}`.match(/[^\/]+$/)[0];

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

    function HandleResourcePicker(resource){

        console.log(resource.selection[0])
        console.log(slugify('testing this title ë ctccć ;]'))
        axios.post('/app/graphql', {
            query: `
            {
                collection(id: "${resource.selection[0].id}") {
                    title
                }
            }
            `
        })
        .then(function (response) {
            // handle success
            let collectionInfo = {
                ...resource.selection[0],
                collectionUrl: `https://codingphaseapp.myshopify.com/collections/${slugify(response.data.collection.title)}`
            }
            // console.log("response from server");
            // console.log(response);
            console.log("new object collectioninfo");
            console.log(collectionInfo);
            setCollectionData(collectionInfo)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }
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
        let link_url = '';
        if(formText.discountCode == ''){
            link_url = `${collectionData.collectionUrl}?${formText.campaignSource == '' ? '' : `utm_source=${formText.campaignSource.replace(/ /g, '%20')}`}${formText.campaignMedium == '' ? '' : `&utm_medium=${formText.campaignMedium.replace(/ /g, '%20')}`}${formText.campaignName == '' ? '' : `&utm_campaign=${formText.campaignName.replace(/ /g, '%20')}`}${formText.campaignTerm == '' ? '' : `&utm_term=${formText.campaignTerm.replace(/ /g, '%20')}`}${formText.campaignContent == '' ? '' : `&utm_campaign=${formText.campaignContent.replace(/ /g, '%20')}`}`
        } else {
            link_url = `${domainUrl}/discount/${formText.discountCode}?redirect=%2Fcollections%2F${slug}${formText.campaignSource == '' ? '' : `&utm_source=${formText.campaignSource.replace(/ /g, '%20')}`}${formText.campaignMedium == '' ? '' : `&utm_medium=${formText.campaignMedium.replace(/ /g, '%20')}`}${formText.campaignName == '' ? '' : `&utm_campaign=${formText.campaignName.replace(/ /g, '%20')}`}${formText.campaignTerm == '' ? '' : `&utm_term=${formText.campaignTerm.replace(/ /g, '%20')}`}${formText.campaignContent == '' ? '' : `&utm_campaign=${formText.campaignContent.replace(/ /g, '%20')}`}`
        }
        
        axios.post('/api/createlink', {
            campaign_source: formText.campaignSource,
            campaign_medium: formText.campaignMedium,
            campaign_name: formText.campaignName,
            campaign_term: formText.campaignTerm,
            campaign_content: formText.campaignContent,
            discount_code: formText.discountCode,
            original_content_url: collectionData.collectionUrl,
            original_content_title: collectionData.title,
            original_content_id: collectionData.id,
            link_type: 'collection',
            link_img_url: collectionData.image.originalSrc,
            user_id: document.getElementById("userId").value,
            link_url: link_url
          })
          .then(function (response) {
              if(response.data == "Saved Data"){
                    setShowToast(true);
                  history.push('/app/links/all')
              }
            console.log(response);
          })
          .catch(function (error) {
            setShowErrorToast(true);
            setShowToast(true);
            console.log(error);
          });
    }
    return(<>
        <TitleBar title="Create New Collection Link" />
        {showToast ? (
          <Toast content={`Created Link`} onDismiss={() => {
            setShowToast(false)
            setShowErrorToast(false)
          } } error={showErrorToast} />
        ) : null}
        <ResourcePicker resourceType="Collection" open={resourcePickerOpen} onSelection={HandleResourcePicker} onCancel={() => history.push('/app')} />
        <div className={collectionData == false ? "app-page-title d-none" : "app-page-title"}>
            <div className="page-title-wrapper">
                <div className="page-title-heading">
                    <div className="page-title-icon">
                        <i className="pe-7s-display1 icon-gradient bg-premium-dark">
                        </i>
                    </div>
                    <div>Create A New Collection Link
                        <div className="page-title-subheading">
                            Choose a collection and create a link to promote collection.
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
        {collectionData == false ? "" : <Content collectionData={collectionData} formText={formText} handleText={handleText} domainUrl={domainUrl} slug={slug}/>}

        
        
    </>)
}

function UrlPreview(props){
    

    if(props.formText.discountCode == ''){
        return(<>
            <div className="position-relative form-group">
            {`${props.collectionData.collectionUrl}?${props.formText.campaignSource == '' ? '' : `utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
            </div>
        </>)
    } else {
        return(<>
            <div className="position-relative form-group">
            {`${props.domainUrl}/discount/${props.formText.discountCode}?redirect=%2Fcollections%2F${props.slug}${props.formText.campaignSource == '' ? '' : `&utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
            </div>
        </>)
    }
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
                            <label htmlFor="collectionUrl">Collection URL</label>
                            <input name="collectionUrl" id="collectionUrl" placeholder="Collection URL" type="text" className="form-control" defaultValue={props.collectionData.collectionUrl} />
                        </div>
                        <div className="position-relative form-group">
                            <label htmlFor="discountCode">Discount Code</label>
                            <input onChange={(event) => props.handleText('discountCode', event.target.value)} name="discountCode" id="discountCode" placeholder="50JULY4, 2021XMAS" type="text" className="form-control" value={props.formText.discountCode} />
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
                        
                        
                        </form>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="main-card mb-3 card">
                    <div className="card-body">
                        <h5 className="card-title">Collection</h5>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <img src={props.collectionData.image.originalSrc} className="img-fluid"/>
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <h2>{props.collectionData.title}</h2>
                            </div>
                        </div>
                        <h5 className="card-title">Link Preview</h5>
                        <UrlPreview collectionData={props.collectionData} formText={props.formText} domainUrl={props.domainUrl} slug={props.slug} />
                        
                    </div>
                </div>
            </div>
        </div>
    </>)
}