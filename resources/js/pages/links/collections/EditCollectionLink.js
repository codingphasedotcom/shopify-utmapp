import React, {useState, useEffect} from 'react';
import {TitleBar, useRoutePropagation, ResourcePicker, Toast} from '@shopify/app-bridge-react';
import {useLocation, useHistory, useParams} from 'react-router-dom';
import axios from 'axios';

export default function EditCollectionLink(props){
    let location = useLocation();
    // console.log(location)
    useRoutePropagation(location);
    const history = useHistory();
    const link_id = useParams().id;

    const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [collectionData, setCollectionData] = useState(false);
    const [formText, setFormText] = useState({
        discountCode: '',
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


    useEffect(() => {
        axios.get(`/api/links/${link_id}`)
        .then(function (response) {
            setFormText({
                discountCode: response.data.discount_code == null ? '' : response.data.discount_code,
                campaignSource: response.data.campaign_source == null ? '' : response.data.campaign_source,
                campaignMedium: response.data.campaign_medium == null ? '' : response.data.campaign_medium,
                campaignName: response.data.campaign_name == null ? '' : response.data.campaign_name,
                campaignTerm: response.data.campaign_term == null ? '' : response.data.campaign_term,
                campaignContent: response.data.campaign_content == null ? '' : response.data.campaign_content,
                collectionUrl: response.data.original_content_url == null ? '' : response.data.original_content_url,
                title: response.data.original_content_title == null ? '' : response.data.original_content_title,
                id: response.data.original_content_id == null ? '' : response.data.original_content_id,
                linkImgUrl: response.data.link_img_url == null ? '' : response.data.link_img_url,
            })
            
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }, []);

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
                collectionUrl: `https://codingphaseapp.myshopify.com/collections/${slugify(response.data.collection.title)}`,
                linkImgUrl: resource.selection[0].image.originalSrc
            }
            // console.log("response from server");
            // console.log(response);
            console.log("new object collectioninfo");
            console.log(collectionInfo);
            setFormText({...formText, ...collectionInfo})
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }
    function clickedEditCollectionLink(){
        setResourcePickerOpen(true);
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
        axios.put(`/api/links/${link_id}`, {
            campaign_source: formText.campaignSource,
            campaign_medium: formText.campaignMedium,
            campaign_name: formText.campaignName,
            campaign_term: formText.campaignTerm,
            campaign_content: formText.campaignContent,
            discount_code: formText.discountCode,
            original_content_url: formText.collectionUrl,
            original_content_title: formText.title,
            original_content_id: formText.id,
            link_type: 'collection',
            link_img_url: formText.linkImgUrl,
            user_id: document.getElementById("userId").value
          })
          .then(function (response) {
              if(response.data == "Updated Data"){
                  setShowToast(true);
              }
            console.log(response);
          })
          .catch(function (error) {
              setShowErrorToast(true);
              setShowToast(true);
            console.log(error);
          });
    }
    function deleteLink(id){
        axios.delete(`/api/links/${id}`)
        .then(function (response) {
            if(response.data == "Link Deleted") {
                history.push('/app/links/all')
            }
            
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    return(<>
        <TitleBar title="Create New Collection Link" />
        <ResourcePicker resourceType="Collection" open={resourcePickerOpen} onSelection={HandleResourcePicker} onCancel={() => setResourcePickerOpen(false)} />
        {showToast ? (
          <Toast content={`Collection with ID: ${link_id} has been updated`} onDismiss={() => {
            setShowToast(false)
            setShowErrorToast(false)
          } } error={showErrorToast} />
        ) : null}
        <div className={"app-page-title"}>
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
                        <button onClick={() => deleteLink(link_id)} className="mb-2 mr-2 btn btn-danger">
                            <i className="pe-7s-trash"> </i> Delete
                        </button>
                        
                    </div>
                </div>    
            </div>
        </div>  
        <Content clickedEditCollectionLink={clickedEditCollectionLink} collectionData={collectionData} formText={formText} handleText={handleText} />

        
        
    </>)
}

function UrlPreview(props){
    const domainUrl = `${props.collectionData.collectionUrl}`.match(/^(?:\/\/|[^\/]+)*/)[0];
    const slug = `${props.collectionData.collectionUrl}`.match(/[^\/]+$/)[0];

    if(props.formText.discountCode == ''){
        return(<>
            <div className="position-relative form-group">
            {`${props.collectionData.collectionUrl}?${props.formText.campaignSource == '' ? '' : `utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
            </div>
        </>)
    } else {
        return(<>
            <div className="position-relative form-group">
            {`${domainUrl}/discount/${props.formText.discountCode}?redirect=%2Fcollections%2F${slug}${props.formText.campaignSource == '' ? '' : `&utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
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
                            <h4 onClick={props.clickedEditCollectionLink} style={{cursor: 'pointer'}}>{props.formText.collectionUrl}</h4>
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
                        
                        <button className="mt-1 btn btn-primary">Submit</button>
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
                                <img src={props.formText.linkImgUrl} className="img-fluid"/>
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <h2>{props.formText.title}</h2>
                            </div>
                        </div>
                        <h5 className="card-title">Link Preview</h5>
                        <UrlPreview collectionData={props.formText} formText={props.formText} />
                        
                    </div>
                </div>
            </div>
        </div>
    </>)
}