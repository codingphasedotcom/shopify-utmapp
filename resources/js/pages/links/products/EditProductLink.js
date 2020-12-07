import React, {useState, useEffect} from 'react';
import {TitleBar, useRoutePropagation, ResourcePicker, Toast} from '@shopify/app-bridge-react';
import {useLocation, useHistory, useParams} from 'react-router-dom';
import axios from 'axios';

export default function EditProductLink(props){
    let location = useLocation();
    // console.log(location)
    useRoutePropagation(location);
    const history = useHistory();
    const link_id = useParams().id;

    

    const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [productData, setProductData] = useState(false);
    const [formText, setFormText] = useState({
        discountCode: '',
        campaignSource: '',
        campaignMedium: '',
        campaignName: '',
        campaignTerm: '',
        campaignContent: '',
        product_url: '',
        title: '',
        id: '',
    });
    const domainUrl = `${formText.productUrl}`.match(/^(?:\/\/|[^\/]+)*/)[0];
    const slug = `${formText.productUrl}`.match(/[^\/]+$/)[0];

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
                productUrl: response.data.original_content_url == null ? '' : response.data.original_content_url,
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
    function clickedEditProductLink(){
        setResourcePickerOpen(true);
    }
    function HandleResourcePicker(resource){
        // console.log(resource.selection[0])
        
        axios.post('/app/graphql', {
            query: `
            {
                product(id: "${resource.selection[0].id}") {
                  onlineStoreUrl
                }
            }
            `
        })
        .then(function (response) {
            // handle success
            let productInfo = {
                ...resource.selection[0],
                productUrl: response.data.product.onlineStoreUrl,
                linkImgUrl: resource.selection[0].images[0].originalSrc
            }
            // console.log("response from server");
            // console.log(response);
            console.log("new object productinfo");
            console.log({ ...formText, ...productInfo})
            setFormText({ ...formText, ...productInfo})
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
            link_url = `${formText.productUrl}?${formText.campaignSource == '' ? '' : `utm_source=${formText.campaignSource.replace(/ /g, '%20')}`}${formText.campaignMedium == '' ? '' : `&utm_medium=${formText.campaignMedium.replace(/ /g, '%20')}`}${formText.campaignName == '' ? '' : `&utm_campaign=${formText.campaignName.replace(/ /g, '%20')}`}${formText.campaignTerm == '' ? '' : `&utm_term=${formText.campaignTerm.replace(/ /g, '%20')}`}${formText.campaignContent == '' ? '' : `&utm_campaign=${formText.campaignContent.replace(/ /g, '%20')}`}`
        } else {
            link_url = `${domainUrl}/discount/${formText.discountCode}?redirect=%2Fproducts%2F${slug}${formText.campaignSource == '' ? '' : `&utm_source=${formText.campaignSource.replace(/ /g, '%20')}`}${formText.campaignMedium == '' ? '' : `&utm_medium=${formText.campaignMedium.replace(/ /g, '%20')}`}${formText.campaignName == '' ? '' : `&utm_campaign=${formText.campaignName.replace(/ /g, '%20')}`}${formText.campaignTerm == '' ? '' : `&utm_term=${formText.campaignTerm.replace(/ /g, '%20')}`}${formText.campaignContent == '' ? '' : `&utm_campaign=${formText.campaignContent.replace(/ /g, '%20')}`}`
        }
        axios.put(`/api/links/${link_id}`, {
            campaign_source: formText.campaignSource,
            campaign_medium: formText.campaignMedium,
            campaign_name: formText.campaignName,
            campaign_term: formText.campaignTerm,
            campaign_content: formText.campaignContent,
            discount_code: formText.discountCode,
            original_content_url: formText.productUrl,
            original_content_title: formText.title,
            original_content_id: formText.id,
            link_type: 'product',
            link_img_url: formText.linkImgUrl,
            user_id: document.getElementById("userId").value,
            link_url: link_url
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
        <TitleBar title="Edit Product Link" />
        <ResourcePicker resourceType="Product" open={resourcePickerOpen} onSelection={HandleResourcePicker} onCancel={() => setResourcePickerOpen(false)} />
        {showToast ? (
          <Toast content={`Product with ID: ${link_id} has been updated`} onDismiss={() => {
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
                    <div>Edit Product Link
                        <div className="page-title-subheading">
                            Edit Product Link
                        </div>
                    </div>
                </div>
                <div className="page-title-actions">
                    
                    <div className="d-inline-block dropdown">
                        <button type="button" className="btn-shadow btn btn-info" onClick={clickedSaveBtn}>
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
        
        {formText == false ? "" : <Content formText={formText} handleText={handleText} clickedEditProductLink={clickedEditProductLink} slug={slug} domainUrl={domainUrl} />}

        
        
    </>)
}
function UrlPreview(props){
    

    if(props.formText.discountCode == ''){
        return(<>
            <div className="position-relative form-group">
            {`${props.formText.productUrl}?${props.formText.campaignSource == '' ? '' : `utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
            </div>
        </>)
    } else {
        return(<>
            <div className="position-relative form-group">
            {`${props.domainUrl}/discount/${props.formText.discountCode}?redirect=%2Fproducts%2F${props.slug}${props.formText.campaignSource == '' ? '' : `&utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
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
                            <label htmlFor="productUrl">Product URL</label>
                            <h4 onClick={props.clickedEditProductLink} style={{cursor: 'pointer'}}>{props.formText.productUrl}</h4>
                            
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
                        <h5 className="card-title">Product</h5>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <img src={props.formText.linkImgUrl} className="img-fluid"/>
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <h2>{props.formText.title}</h2>
                            </div>
                        </div>
                        <h5 className="card-title">Link Preview</h5>
                        <UrlPreview formText={props.formText} slug={props.slug} domainUrl={props.domainUrl}/>
                        
                    </div>
                </div>
            </div>
        </div>
    </>)
}