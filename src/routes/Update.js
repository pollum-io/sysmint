import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import assetImg from "../images/asset.svg";
import AdvancedPanel from "../components/AdvancedPanel";
import loaderImg from "../images/spinner.svg";

export default function Update() {
  const controller = useSelector((state) => state.controller);
  const [tokens, setTokens] = useState([]);
  const [file, setFile] = useState();
  const [assetGuid, setAssetGuid] = useState();
  const [description, setDescription] = useState("");
  const [advancedOptions, setAdvancedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    controller &&
      setIsLoading(true);

      controller._sys.getUserMintedTokens().then((data) => {
        data && setTokens(data);

        setIsLoading(false);
      });

    return () => setTokens([]);
  }, []);

  useEffect(() => {
    tokens.length || !tokens && setIsLoading(false);
  }, [tokens]);

  const dataYup = {
    assetGuid,
    description,
  };

  const schema = yup.object().shape({
    assetGuid: yup.string().required("Token is required!"),
    description: yup.string(),
  });

  const handleUpdateAsset = async (event) => {
    event.preventDefault();

    await schema
      .validate(dataYup, { abortEarly: false })
      .then(() => {
        controller &&
          controller
            .handleUpdateAsset({
              assetGuid: assetGuid,
              description: description,
              ...advancedOptions
            })
            .catch((err) => {
              toast.dismiss()
              toast.error(err, {position: "bottom-right"});
            });

        event.target.reset();
      })
      .catch((err) => {
        err.errors.forEach((error) => {
          toast.error(error, {position: "bottom-right"});
        });
      });
  };

  const handleInputChange = (setState) => {
    return (event) => {
      setState(event.target.value);
    };
  };

  const handleInputFile = (setState) => {
    return async (event) => {
      const _file = event.target.files[0];

      setState(_file);

      // upload image
    };
  };

  return (
    <section>
      <div className="inner wider">
        <h1>Update Token Specifications</h1>
        <p className="c">Change certain properties of an asset if the asset definition allows 
          the Issuer/Owner to do so. This process uses `assetUpdate`.</p>
        <p className="c">
        Please exercise caution when updating asset properties, especially
         [Issuer Rights]. You should fully understand the functionality
          associated with a field before changing it.
        </p>
        <p className="c">
        NOTE: This tool cannot be used to update NFTs created with SysMint 
        because SysMint renders an NFT definition unchangeable upon creation 
        (all [Issuer Rights] fields are permanently OFF).
        </p>

        <form onSubmit={handleUpdateAsset}>
          <div className="row">
            <div className="spacer col-100"></div>
          </div>
          <ToastContainer />
          <div className="form-line">
            <div className="form-group col-100">
            <label htmlFor="token" className="loaderTokens">
                <span >
                  Standard Token{" "}
                  {isLoading && (
                    <img  src={loaderImg} alt="" />
                  )}
                </span>
              </label>
              <select
                onChange={handleInputChange(setAssetGuid)}
                className="form-control"
                id="token"
              >
                <option></option>
                {tokens.map((token) => (
                  <option value={token.assetGuid} key={token.assetGuid}>
                    {token.assetGuid} - {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-line">
            <div className="form-group col-67 col-md-50 col-sm-100">
              <label htmlFor="description">
                Description{" "}
                <i className="icon-info-circled" title="Description in ASCII describing token. The description will be encoded via JSON in the pubdata field for the asset and will be in the 'desc' field of the JSON object."></i>
              </label>
              <textarea
                onChange={handleInputChange(setDescription)}
                className="form-control"
                id="description"
                rows="4"
              ></textarea>
              <p className="help-block">Max length: 256 bytes</p>
            </div>
            <div className="form-group col-33 col-md-50 col-sm-100">
              <div className="fileupload">
                <label htmlFor="logo">Upload logo</label>
                <input
                  onChange={handleInputFile(setFile)}
                  type="file"
                  id="logo"
                />
                <img src={file ? URL.createObjectURL(file) : assetImg} alt="" />
              </div>
            </div>
          </div>

          <AdvancedPanel
            onChange={setAdvancedOptions}
            renderContractField
            toggleButton={false}
          />

          <div className="btn-center">
            <button>Update Token</button>
          </div>
        </form>
      </div>
    </section>
  );
}