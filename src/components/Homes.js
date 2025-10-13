import { useEffect, useState } from "react";
import close from "../assets/close.svg";

const Homes = ({ home, provider, escrow, toggleProp }) => {
  const [hasBought, setHasBought] = useState(false);
  const [hasLend, setHasLend] = useState(false);
  const [hasInspect, setHasInspect] = useState(false);
  const [hasSold, setHasSold] = useState(false);

  const [buyer, setBuyer] = useState(null);
  const [lender, setLender] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [seller, setSeller] = useState(null);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);

  const loadAccount = async () => {
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address.toLowerCase());
    } catch (error) {
      console.error("Failed to load wallet address:", error);
    }
  };

  const fetchDetails = async () => {
    const buyer = await escrow.buyer(home.id);
    setBuyer(buyer);
    setHasBought(await escrow.approval(home.id, buyer));

    const seller = await escrow.seller();
    setSeller(seller);
    setHasSold(await escrow.approval(home.id, seller));

    const lender = await escrow.lender();
    setLender(lender);
    setHasLend(await escrow.approval(home.id, lender));

    const inspector = await escrow.inspector();
    setInspector(inspector);
    setHasInspect(await escrow.inspectionPassed(home.id));
  };

  const fetchOwner = async () => {
    const owner = await escrow.buyer(home.id);
    if (await escrow.isListed(home.id)) setOwner(owner);
  };

  const inspectHandler = async () => {
    const signer = await provider.getSigner();
    const transaction = await escrow.connect(signer).updateInspectionStatus(home.id, true);
    await transaction.wait();
    setHasInspect(true);
  };

  const buyHandler = async () => {
    const escrowAmount = await escrow.escrowAmount(home.id);
    const signer = await provider.getSigner();
    let transaction = await escrow.connect(signer).depositEarnest(home.id, { value: escrowAmount });
    await transaction.wait();

    transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();
    setHasBought(true);
  };

  const sellHandler = async () => {
    const signer = await provider.getSigner();
    let transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();
    setHasSold(true);
  };

  const lenderHandler = async () => {
    const signer = await provider.getSigner();
    let transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();

    const lendAmount =
      (await escrow.purchasePrice(home.id)) - (await escrow.escrowAmount(home.id));
    await signer.sendTransaction({ to: escrow.address, value: lendAmount.toString() });
    setHasLend(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAccount();
    fetchDetails();
    fetchOwner();
  }, [hasSold]);

  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={home.image} alt="Home" />
        </div>

        <div className="home__overview">
          <h1>{home.name}</h1>
          <p>
            <strong>{home.attributes[2].value}</strong> bds |{" "}
            <strong>{home.attributes[3].value}</strong> bds |{" "}
            <strong>{home.attributes[4].value}</strong> bds |
          </p>
          <p>{home.address}</p>
          <h2>
            <strong>{home.attributes[0].value}</strong> ETH
          </h2>

          {owner ? (
            <div className="home__owned">
              <p>Owned by {owner.slice(0, 6) + "..." + owner.slice(38, 42)}</p>
            </div>
          ) : (
            <div>
              {account === inspector ? (
                <button className="home__buy" onClick={inspectHandler} disabled={hasInspect}>
                  Approve Inspection
                </button>
              ) : account === lender ? (
                <button className="home__buy" onClick={lenderHandler} disabled={hasLend}>
                  Approve Lend
                </button>
              ) : account === seller ? (
                <button className="home__buy" onClick={sellHandler} disabled={hasSold}>
                  Approve Sale
                </button>
              ) : (
                <button className="home__buy" onClick={buyHandler} disabled={hasBought}>
                  Buy Property
                </button>
              )}
            </div>
          )}

          <button onClick={toggleProp} className="home__close">
            <img src={close} alt="Close" />
          </button>
          <button className="home__contact">Contact agent</button>
          <hr />
          <h2>Overview</h2>
          <p>{home.description}</p>
          <hr />
          <h2>Facts and features</h2>
          <ul>
            {home.attributes.map((attributes, index) => (
              <li key={index}>
                <strong>{attributes.trait_type}</strong>: {attributes.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Homes;
