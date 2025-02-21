import { NextResponse } from "next/server";
// const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

export async function POST(request) {
  try {
    let date = new Date();
    let image_URL = request.url;
    let ext = getExtention(image_URL);
    ext = "." + ext[-1];
    // const { config, fs } = RNFetchBlob
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          "/image_" +
          Math.floor(date.getTime() + date.getSeconds() / 1) +
          ext,
        description: "Image",
      },
    };

    const res = postMedia(options.addAndroidDownloads.path, image_URL);
    // config(options)
    //   .fetch('GET', image_URL)
    //   .then((res) => {
    //     console.log(res)
    return NextResponse.json({ downloadNFTResponse: JSON.stringify(res) });
    //     // console.log('res -> ', JSON.stringify(res))
    //     // alert('Image Downloaded Successfully.')
    //   })
  } catch (error) {
    return NextResponse.json({ downloadNFTResponse: JSON.stringify(error) });
  }
}

async function postMedia(path, uri) {
  let type = uri.substring(uri.lastIndexOf(".") + 1);
  const headers = await this.getHeaders("multipart/form-data");
  const form = new FormData();
  form.append("file", { uri, name: "media", type: `image/${type}` });
  const options = {
    method: "POST",
    headers,
    body: form,
  };
  return this.fetch(path, options)
    .then((res) => {
      console.log("FETCH MEDIA", res);
      this.processResponse(path, options, res);
    })
    .catch((err) => {
      console.log("FETCH ERROR", err);
    });
}

const getExtention = (filename) => {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
};
// try {
//   const url = request.url
//   let fileName = url.split('/')[url.split('/').length - 1]
//
//   let req = new XMLHttpRequest()
//   req.open('GET', url, true)
//   req.responseType = 'blob'
//
//   req.onload = function() {
//     if (req.status === 200) {
//       var blob = req.response
//       var isIE = false || !!document.documentMode
//
//       if (isIE) {
//         window.navigator.msSaveBlob(blob, fileName)
//       } else {
//         var url = window.URL || window.webkitURL
//         var link = url.createObjectURL(blob)
//         var a = document.createElement('a')
//         a.style.display = 'none'
//         a.href = link
//         a.download = fileName
//         document.body.appendChild(a)
//         a.click()
//         window.URL.revokeObjectURL(link)
//         document.body.removeChild(a)
//       }
//     } else {
//       console.error('Failed to download:', req.statusText)
//     }
//   }
//
//   req.onerror = function() {
//     console.error('Failed to download 1 :', req.statusText)
//   }
//
//   await req.send()
//   return NextResponse.json({ txResponse: 'File download initiated.' })
// } catch (error) {
//   console.error('Error in downloading:', error)
//   return NextResponse.json({ txRespone: JSON.stringify(error) })
// }
