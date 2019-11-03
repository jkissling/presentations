# Certificate Installation

This steps will export your local Windows Certificate into a .pfx, which can be used with the webpack-dev-server to run your page in a secure and valid context. 

## Export the Certificate

- Open `Manage Computer Certificates` on Windows, by searching in the Startmenu
- Browse to: `Personal -> Certificates`
- Usually there are two Certificates with your Hostname, find the _one_ which
    - Ensures the identity of a remote computer
    - Proves your identity to a remote computer



- Go to `Details`
- Click `Copy to File`
- Click `Next`
- Select `Yes, export the Private Key`
- Click `Next`
- Apply following Settings


- Enter the password `12345678`
    - It has to be this password, because it is configured in the template!!!

- Save the Certificate as `certificate.pfx`
- Make sure the path in `package.json > scripts > start` points to your `certificate.pfx`

Now try to start webpack
```
npm start
```

If an node error appears (`certificate not found` | `not enough data`) make sure you have the right certificate and the certificate has the correct name and password.