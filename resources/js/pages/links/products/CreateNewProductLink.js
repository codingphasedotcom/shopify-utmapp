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
    const [productData, setProductData] = useState(false);
    const [formText, setFormText] = useState({
        discountCode: '',
        campaignSource: '',
        campaignMedium: '',
        campaignName: '',
        campaignTerm: '',
        campaignContent: ''
    });

    const domainUrl = `${productData.productUrl}`.match(/^(?:\/\/|[^\/]+)*/)[0];
    const slug = `${productData.productUrl}`.match(/[^\/]+$/)[0];

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
                productUrl: response.data.product.onlineStoreUrl
            }
            // console.log("response from server");
            // console.log(response);
            // console.log("new object productinfo");
            console.log(productInfo);
            setProductData(productInfo)
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
        console.log(productData);
        axios.post('/api/createlink', {
            campaign_source: formText.campaignSource,
            campaign_medium: formText.campaignMedium,
            campaign_name: formText.campaignName,
            campaign_term: formText.campaignTerm,
            campaign_content: formText.campaignContent,
            discount_code: formText.discountCode,
            original_content_url: productData.productUrl,
            original_content_title: productData.title,
            original_content_id: productData.id,
            link_type: 'product',
            link_img_url: productData.images[0].originalSrc,
            user_id: document.getElementById("userId").value,
            link_url: `${domainUrl}/discount/${formText.discountCode}?redirect=%2Fproducts%2F${slug}${formText.campaignSource == '' ? '' : `&utm_source=${formText.campaignSource.replace(/ /g, '%20')}`}${formText.campaignMedium == '' ? '' : `&utm_medium=${formText.campaignMedium.replace(/ /g, '%20')}`}${formText.campaignName == '' ? '' : `&utm_campaign=${formText.campaignName.replace(/ /g, '%20')}`}${formText.campaignTerm == '' ? '' : `&utm_term=${formText.campaignTerm.replace(/ /g, '%20')}`}${formText.campaignContent == '' ? '' : `&utm_campaign=${formText.campaignContent.replace(/ /g, '%20')}`}`
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
        <TitleBar title="Create New Product Link" />
        {showToast ? (
          <Toast content={`Created Link`} onDismiss={() => {
            setShowToast(false)
            setShowErrorToast(false)
          } } error={showErrorToast} />
        ) : null}
        <ResourcePicker resourceType="Product" open={resourcePickerOpen} onSelection={HandleResourcePicker} onCancel={() => history.push('/app')} />
        <div className={productData == false ? "app-page-title d-none" : "app-page-title"}>
            <div className="page-title-wrapper">
                <div className="page-title-heading">
                    <div className="page-title-icon">
                        <i className="pe-7s-display1 icon-gradient bg-premium-dark">
                        </i>
                    </div>
                    <div>Create A New Product Link
                        <div className="page-title-subheading">
                            Choose a product and create a link to promote product.
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
                        
                    </div>
                </div>    
            </div>
        </div>  
        {productData == false ? "" : <Content productData={productData} formText={formText} handleText={handleText} slug={slug} domainUrl={domainUrl} />}

        
        
    </>)
}
function UrlPreview(props){
    

    if(props.formText.discountCode == ''){
        return(<>
            <div className="position-relative form-group">
            {`${props.productData.productUrl}?${props.formText.campaignSource == '' ? '' : `utm_source=${props.formText.campaignSource.replace(/ /g, '%20')}`}${props.formText.campaignMedium == '' ? '' : `&utm_medium=${props.formText.campaignMedium.replace(/ /g, '%20')}`}${props.formText.campaignName == '' ? '' : `&utm_campaign=${props.formText.campaignName.replace(/ /g, '%20')}`}${props.formText.campaignTerm == '' ? '' : `&utm_term=${props.formText.campaignTerm.replace(/ /g, '%20')}`}${props.formText.campaignContent == '' ? '' : `&utm_campaign=${props.formText.campaignContent.replace(/ /g, '%20')}`}`}
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
                            <input name="productUrl" id="productUrl" placeholder="Product URL" type="text" className="form-control" defaultValue={props.productData.productUrl} />
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
                        <h5 className="card-title">Product</h5>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <img src={props.productData.images[0].originalSrc} className="img-fluid"/>
                            </div>
                            <div className="col-md-8 d-flex align-items-center">
                                <h2>{props.productData.title}</h2>
                            </div>
                        </div>
                        <h5 className="card-title">Link Preview</h5>
                        <UrlPreview productData={props.productData} formText={props.formText} domainUrl={props.domainUrl} slug={props.slug}/>
                        
                    </div>
                </div>
            </div>
        </div>
    </>)
}