const { sign } = require("jsonwebtoken");
const {
  jwtSecret,
  snapUrl,
  snapServerKey,
  baseUrl,
  snapIsProduction,
  systemEmail,
  systemEmailPassword,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryName,
  clientUrl,
  sendinBluePass,
  sendinBlueUser,
} = require("../config");
const axios = require("axios").default;
const { sha512 } = require("js-sha512");
const { Snap } = require("midtrans-client");
const { createTransport, createTestAccount } = require("nodemailer");
const cloudinary = require("cloudinary").v2;

const getJwtToken = (payload) => {
  const token = sign(payload, jwtSecret);
  return token;
};

const paginationObj = (
  length,
  limit = 10,
  currentPage = 1,
  queryOption = {}
) => {
  let prev = "null",
    next = "null";
  const totalPage = Math.ceil(length / limit);

  if (parseInt(currentPage) > 1) {
    prev = `${baseUrl}/api/v1/products?page=${parseInt(currentPage) - 1}`;

    for (let query in queryOption) {
      if (queryOption[query] && queryOption[query] !== "null") {
        prev += `&${query}=${queryOption[query]}`;
      }
    }
  }

  if (parseInt(currentPage) < totalPage) {
    next = `${baseUrl}/products?page=${parseInt(currentPage) + 1}`;
    for (let query in queryOption) {
      if (queryOption[query] != null) {
        next += `&${query}=${queryOption[query]}`;
      }
    }
  }

  return {
    total_page: totalPage,
    prev,
    next,
  };
};

const snapBodyBuilder = (
  carts,
  user,
  transaction,
  total,
  shipment_service,
  shipment_cost
) => {
  const item_details = carts.map((cart, index) => {
    return {
      id: cart.product.id,
      price: cart.product.price,
      quantity: cart.qty,
      name: cart.product.name.substring(0, 50),
    };
  });

  item_details.push({
    id: "shipments-01",
    price: shipment_cost,
    quantity: 1,
    name: `Shipment with ${shipment_service.toUpperCase()}`,
  });

  const customer_details = {
    first_name: user.name,
    email: user.email,
    phone: user.phone_number,
  };
  let r = (Math.random() + 1).toString(36).substring(7);
  return {
    transaction_details: {
      order_id: transaction.id + "-" + r,
      gross_amount: total,
    },
    item_details,
    customer_details,
  };
};

const getSnapUrl = async (
  carts,
  user,
  transaction,
  total,
  shipment_service,
  shipment_cost
) => {
  const auth = Buffer.from(snapServerKey + ":").toString("base64");
  const bodyData = snapBodyBuilder(
    carts,
    user,
    transaction,
    total,
    shipment_service,
    shipment_cost
  );
  const { data, status, message } = await axios
    .post(snapUrl, bodyData, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    .catch((err) => {
      return {
        message: err?.response?.messages,
        status: err?.response?.status,
      };
    });

  return {
    url: data?.redirect_url,
    bodyData,
    status,
    message,
  };
};

const getSnapUrlPack = async (
  carts,
  user,
  transaction,
  total,
  shipment_service,
  shipment_cost
) => {
  const snap = new Snap({
    isProduction: snapIsProduction,
    serverKey: snapServerKey,
  });
  try {
    const bodyData = snapBodyBuilder(
      carts,
      user,
      transaction,
      total,
      shipment_service,
      shipment_cost
    );

    const { redirect_url } = await snap.createTransaction(bodyData);

    return {
      url: redirect_url,
      bodyData,
      status: 201,
    };
  } catch (err) {
    return {
      status: 400,
      message: err.message,
    };
  }
};

/**
 *
 * @param {string} fileName
 * @param {string} type "products|profile"
 * @returns string
 */
function getFileImageUrl(fileName, type = "products") {
  const urlPrefix = baseUrl + "/images/" + type + "/";

  if (fileName?.search("http") === -1) {
    return urlPrefix + fileName;
  }
  return fileName;
}

/**
 *
 * @param {object[]} fileNames
 * @param {string} type "products|profile"
 * @returns string[]
 */
function getFileImageUrlArray(fileNames, type = "products", throughIndex) {
  const urlPrefix = baseUrl + "/images/" + type + "/";

  return fileNames.map((value) => {
    if (!throughIndex) {
      if (value?.image_url?.search("http") === -1) {
        value.image_url = urlPrefix + value.image_url;
      }
    } else {
      if (value[throughIndex]?.image_url?.search("http") === -1) {
        value[throughIndex].image_url =
          urlPrefix + value[throughIndex].image_url;
      }
    }

    return value;
  });
}

/**
 *
 * @param {number|string} order_id
 * @param {number|string} status_code
 * @param {number|string} gross_amount
 * @returns
 */
const validateSignatureMidtransKey = (order_id, status_code, gross_amount) => {
  return sha512(order_id + status_code + gross_amount + snapServerKey);
};

const emailInvoiceHtml = (
  transaction_date,
  transaction_total,
  user_name,
  transaction_update,
  order_id,
  raw_body
) => {
  const productItems = raw_body?.item_details
    ?.map(
      (item) => `<tr>
  <td
    width="80%"
    class="purchase_item"
  >
    <span class="f-fallback" >${item?.name}</span
    >
  </td>
  <td class="align-right" width="20%">
    <span class="f-fallback"
      >Rp. ${item?.price}</span
    >
  </td>
</tr>`
    )
    ?.join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 <!-- saved from url=(0081)http://assets.wildbit.com/postmark/templates/dist/basic-full/invoice/content.html -->
 <html>
   <head>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
     <title></title>
     <style type="text/css" rel="stylesheet" media="all">
       /* Base ------------------------------ */
 
       @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
       body {
         width: 100% !important;
         height: 100%;
         margin: 0;
         -webkit-text-size-adjust: none;
       }
 
       a {
         color: #3869d4;
       }
 
       a img {
         border: none;
       }
 
       td {
         word-break: break-word;
       }
 
       .preheader {
         display: none !important;
         visibility: hidden;
         mso-hide: all;
         font-size: 1px;
         line-height: 1px;
         max-height: 0;
         max-width: 0;
         opacity: 0;
         overflow: hidden;
       }
       /* Type ------------------------------ */
 
       body,
       td,
       th {
         font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
       }
 
       h1 {
         margin-top: 0;
         color: #333333;
         font-size: 22px;
         font-weight: bold;
         text-align: left;
       }
 
       h2 {
         margin-top: 0;
         color: #333333;
         font-size: 16px;
         font-weight: bold;
         text-align: left;
       }
 
       h3 {
         margin-top: 0;
         color: #333333;
         font-size: 14px;
         font-weight: bold;
         text-align: left;
       }
 
       td,
       th {
         font-size: 16px;
       }
 
       p,
       ul,
       ol,
       blockquote {
         margin: 0.4em 0 1.1875em;
         font-size: 16px;
         line-height: 1.625;
       }
 
       p.sub {
         font-size: 13px;
       }
       /* Utilities ------------------------------ */
 
       .align-right {
         text-align: right;
       }
 
       .align-left {
         text-align: left;
       }
 
       .align-center {
         text-align: center;
       }
       /* Buttons ------------------------------ */
 
       .button {
         background-color: #3869d4;
         border-top: 10px solid #3869d4;
         border-right: 18px solid #3869d4;
         border-bottom: 10px solid #3869d4;
         border-left: 18px solid #3869d4;
         display: inline-block;
         color: #fff;
         text-decoration: none;
         border-radius: 3px;
         box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
         -webkit-text-size-adjust: none;
         box-sizing: border-box;
       }
 
       .button--green {
         background-color: #22bc66;
         border-top: 10px solid #22bc66;
         border-right: 18px solid #22bc66;
         border-bottom: 10px solid #22bc66;
         border-left: 18px solid #22bc66;
       }
 
       .button--red {
         background-color: #ff6136;
         border-top: 10px solid #ff6136;
         border-right: 18px solid #ff6136;
         border-bottom: 10px solid #ff6136;
         border-left: 18px solid #ff6136;
       }
 
       @media only screen and (max-width: 500px) {
         .button {
           width: 100% !important;
           text-align: center !important;
         }
       }
       /* Attribute list ------------------------------ */
 
       .attributes {
         margin: 0 0 21px;
       }
 
       .attributes_content {
         background-color: #f4f4f7;
         padding: 16px;
       }
 
       .attributes_item {
         padding: 0;
       }
       /* Related Items ------------------------------ */
 
       .related {
         width: 100%;
         margin: 0;
         padding: 25px 0 0 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .related_item {
         padding: 10px 0;
         color: #cbcccf;
         font-size: 15px;
         line-height: 18px;
       }
 
       .related_item-title {
         display: block;
         margin: 0.5em 0 0;
       }
 
       .related_item-thumb {
         display: block;
         padding-bottom: 10px;
       }
 
       .related_heading {
         border-top: 1px solid #cbcccf;
         text-align: center;
         padding: 25px 0 10px;
       }
       /* Discount Code ------------------------------ */
 
       .discount {
         width: 100%;
         margin: 0;
         padding: 24px;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #f4f4f7;
         border: 2px dashed #cbcccf;
       }
 
       .discount_heading {
         text-align: center;
       }
 
       .discount_body {
         text-align: center;
         font-size: 15px;
       }
       /* Social Icons ------------------------------ */
 
       .social {
         width: auto;
       }
 
       .social td {
         padding: 0;
         width: auto;
       }
 
       .social_icon {
         height: 20px;
         margin: 0 8px 10px 8px;
         padding: 0;
       }
       /* Data table ------------------------------ */
 
       .purchase {
         width: 100%;
         margin: 0;
         padding: 35px 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .purchase_content {
         width: 100%;
         margin: 0;
         padding: 25px 0 0 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
 
       .purchase_item {
         padding: 10px 0;
         color: #51545e;
         font-size: 15px;
         line-height: 18px;
       }
 
       .purchase_heading {
         padding-bottom: 8px;
         border-bottom: 1px solid #eaeaec;
       }
 
       .purchase_heading p {
         margin: 0;
         color: #85878e;
         font-size: 12px;
       }
 
       .purchase_footer {
         padding-top: 15px;
         border-top: 1px solid #eaeaec;
       }
 
       .purchase_total {
         margin: 0;
         text-align: right;
         font-weight: bold;
         color: #333333;
       }
 
       .purchase_total--label {
         padding: 0 15px 0 0;
       }
 
       body {
         background-color: #f4f4f7;
         color: #51545e;
       }
 
       p {
         color: #51545e;
       }
 
       p.sub {
         color: #6b6e76;
       }
 
       .email-wrapper {
         width: 100%;
         margin: 0;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #f4f4f7;
       }
 
       .email-content {
         width: 100%;
         margin: 0;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
       }
       /* Masthead ----------------------- */
 
       .email-masthead {
         padding: 25px 0;
         text-align: center;
       }
 
       .email-masthead_logo {
         width: 94px;
       }
 
       .email-masthead_name {
         font-size: 16px;
         font-weight: bold;
         color: #a8aaaf;
         text-decoration: none;
         text-shadow: 0 1px 0 white;
       }
       /* Body ------------------------------ */
 
       .email-body {
         width: 100%;
         margin: 0;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #ffffff;
       }
 
       .email-body_inner {
         width: 570px;
         margin: 0 auto;
         padding: 0;
         -premailer-width: 570px;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         background-color: #ffffff;
       }
 
       .email-footer {
         width: 570px;
         margin: 0 auto;
         padding: 0;
         -premailer-width: 570px;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         text-align: center;
       }
 
       .email-footer p {
         color: #6b6e76;
       }
 
       .body-action {
         width: 100%;
         margin: 30px auto;
         padding: 0;
         -premailer-width: 100%;
         -premailer-cellpadding: 0;
         -premailer-cellspacing: 0;
         text-align: center;
       }
 
       .body-sub {
         margin-top: 25px;
         padding-top: 25px;
         border-top: 1px solid #eaeaec;
       }
 
       .content-cell {
         padding: 35px;
       }
       /*Media Queries ------------------------------ */
 
       @media only screen and (max-width: 600px) {
         .email-body_inner,
         .email-footer {
           width: 100% !important;
         }
       }
 
       @media (prefers-color-scheme: dark) {
         body,
         .email-body,
         .email-body_inner,
         .email-content,
         .email-wrapper,
         .email-masthead,
         .email-footer {
           background-color: #333333 !important;
           color: #fff !important;
         }
         p,
         ul,
         ol,
         blockquote,
         h1,
         h2,
         h3 {
           color: #fff !important;
         }
         .attributes_content,
         .discount {
           background-color: #222 !important;
         }
         .email-masthead_name {
           text-shadow: none !important;
         }
       }
     </style>
     <!--[if mso]>
       <style type="text/css">
         .f-fallback {
           font-family: Arial, sans-serif;
         }
       </style>
     <![endif]-->
   </head>
   <body>
     <span class="preheader"
       >This is an invoice for your purchase on ${transaction_date}.</span
     >
     <table
       class="email-wrapper"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       role="presentation"
     >
       <tbody>
         <tr>
           <td align="center">
             <table
               class="email-content"
               width="100%"
               cellpadding="0"
               cellspacing="0"
               role="presentation"
             >
               <tbody>
                 <tr>
                   <td class="email-masthead">
                     <a
                       href="${clientUrl}"
                       class="f-fallback email-masthead_name"
                     >
                       Dumbways Merch
                     </a>
                   </td>
                 </tr>
                 <!-- Email Body -->
                 <tr>
                   <td
                     class="email-body"
                     width="100%"
                     cellpadding="0"
                     cellspacing="0"
                   >
                     <table
                       class="email-body_inner"
                       align="center"
                       width="570"
                       cellpadding="0"
                       cellspacing="0"
                       role="presentation"
                     >
                       <!-- Body content -->
                       <tbody>
                         <tr>
                           <td class="content-cell">
                             <div class="f-fallback">
                               <h1>Hi ${user_name},</h1>
                               <p>
                                 Thanks for using Dumbways Merch. This is an
                                 invoice for your recent purchase.
                               </p>
                               <table
                                 class="attributes"
                                 width="100%"
                                 cellpadding="0"
                                 cellspacing="0"
                                 role="presentation"
                               >
                                 <tbody>
                                   <tr>
                                     <td class="attributes_content">
                                       <table
                                         width="100%"
                                         cellpadding="0"
                                         cellspacing="0"
                                         role="presentation"
                                       >
                                         <tbody>
                                           <tr>
                                             <td class="attributes_item">
                                               <span class="f-fallback">
                                                 <strong>Amount Due:</strong>
                                                 Rp. ${transaction_total}
                                               </span>
                                             </td>
                                           </tr>
                                           <tr>
                                             <td class="attributes_item">
                                               <span class="f-fallback">
                                                 <strong>Payment At:</strong>
                                                 ${transaction_update}
                                               </span>
                                             </td>
                                           </tr>
                                         </tbody>
                                       </table>
                                     </td>
                                   </tr>
                                 </tbody>
                               </table>
                               <table
                                 class="purchase"
                                 width="100%"
                                 cellpadding="0"
                                 cellspacing="0"
                               >
                                 <tbody>
                                   <tr>
                                     <td>
                                       <h3>${order_id}</h3>
                                     </td>
                                     <td>
                                       <h3 class="align-right">
                                         ${transaction_date}
                                       </h3>
                                     </td>
                                   </tr>
                                   <tr>
                                     <td colspan="2">
                                       <table
                                         class="purchase_content"
                                         width="100%"
                                         cellpadding="0"
                                         cellspacing="0"
                                       >
                                         <tbody>
                                           <tr>
                                             <th
                                               class="purchase_heading"
                                               align="left"
                                             >
                                               <p class="f-fallback">
                                                 Description
                                               </p>
                                             </th>
                                             <th
                                               class="purchase_heading"
                                               align="right"
                                             >
                                               <p class="f-fallback">Amount</p>
                                             </th>
                                           </tr>
                                           ${productItems}
                                           <tr>
                                             <td
                                               width="80%"
                                               class="purchase_footer"
                                               valign="middle"
                                             >
                                               <p
                                                 class="f-fallback purchase_total purchase_total--label"
                                               >
                                                 Total
                                               </p>
                                             </td>
                                             <td
                                               width="20%"
                                               class="purchase_footer"
                                               valign="middle"
                                             >
                                               <p
                                                 class="f-fallback purchase_total"
                                               >
                                                 ${transaction_total}
                                               </p>
                                             </td>
                                           </tr>
                                         </tbody>
                                       </table>
                                     </td>
                                   </tr>
                                 </tbody>
                               </table>
                               <p>
                                 If you have any questions about this invoice,
                                 simply reply to this email or reach out to our
                                 email
                                 for help.
                               </p>
                               <p>Cheers, <br />The Dumbways Merch Team</p>
                               <!-- Sub copy -->
                               <table class="body-sub" role="presentation">
                                 <tbody>
                                   <tr>
                                     <td>
                                       <p class="f-fallback sub">
                                         If you’re having trouble with the button
                                         above, copy and paste the URL below into
                                         your web browser.
                                       </p>
                                     </td>
                                   </tr>
                                 </tbody>
                               </table>
                             </div>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </td>
                 </tr>
                 <tr>
                   <td>
                     <table
                       class="email-footer"
                       align="center"
                       width="570"
                       cellpadding="0"
                       cellspacing="0"
                       role="presentation"
                     >
                       <tbody>
                         <tr>
                           <td class="content-cell" align="center">
                             <p class="f-fallback sub align-center">
                               © 2022 Dumbways Merch. All rights reserved.
                             </p>
                             <p class="f-fallback sub align-center">DumbWays</p>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </td>
                 </tr>
               </tbody>
             </table>
           </td>
         </tr>
       </tbody>
     </table>
   </body>
 </html>
 `;
};

const sendMailTest = async (user_email, invoice_html) => {
  const testUser = await createTestAccount();

  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testUser.user, // generated ethereal user
      pass: testUser.pass, // generated ethereal password
    },
  });

  await transporter.sendMail({
    subject: "DumbMerch Invoice",
    to: user_email,
    from: "DumbMerch Team",
    subject: "Your current transaction invoice",
    html: invoice_html,
  });
};

const sendMail = async (user_email, invoice_html) => {
  /**
   * With Sendin Blue
   */
  const transporter = createTransport({
    service: "SendinBlue",
    auth: {
      user: sendinBlueUser,
      pass: sendinBluePass,
    },
  });

  await transporter.sendMail({
    subject: "DumbMerch Invoice",
    to: user_email,
    from: "DumbMerch Team",
    subject: "Your current transaction invoice",
    html: invoice_html,
    text: "https://dumbmerch-drscripts.netlify.app",
  });

  /**
   *
   * WITH GMAIL
   */
  // const transporter = createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: systemEmail,
  //     pass: systemEmailPassword,
  //   },
  // });

  // await transporter.sendMail({
  //   subject: "DumbMerch Invoice",
  //   to: user_email,
  //   from: "DumbMerch Team",
  //   subject: "Your current transaction invoice",
  //   html: invoice_html,
  // });
};

const cloudImageStore = async (
  fileImage,
  folderName = "dumbmerch_products"
) => {
  cloudinary.config({
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    cloud_name: cloudinaryName,
  });

  const {
    secure_url: image_url,
    public_id,
    format,
  } = await cloudinary.uploader.upload(fileImage?.path, {
    use_filename: true,
    folder: folderName,
    unique_filename: false,
  });

  return {
    image_url,
    file_name: `${public_id}.${format}`,
  };
};

const cloudImageDelete = async (file_name) => {
  cloudinary.config({
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    cloud_name: cloudinaryName,
  });

  const public_id = file_name?.split(".")[0];

  await cloudinary.uploader.destroy(public_id, { resource_type: "image" });
};

module.exports = {
  getJwtToken,
  paginationObj,
  getSnapUrl,
  getFileImageUrl,
  getFileImageUrlArray,
  validateSignatureMidtransKey,
  getSnapUrlPack,
  emailInvoiceHtml,
  sendMailTest,
  sendMail,
  cloudImageStore,
  cloudImageDelete,
};
