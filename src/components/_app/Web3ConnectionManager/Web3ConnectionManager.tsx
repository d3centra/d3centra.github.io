import { useDisclosure } from "@chakra-ui/react"
import { useRumAction } from "@datadog/rum-react-integration"
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from "@web3-react/abstract-connector"
import { useWeb3React } from "@web3-react/core"
import NetworkModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { injected, walletConnect, walletLink } from "connectors"
import { useRouter } from "next/router"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import WalletSelectorModal from "./components/WalletSelectorModal"
import useEagerConnect from "./hooks/useEagerConnect"
import useInactiveListener from "./hooks/useInactiveListener"

const Web3Connection = createContext({
  isWalletSelectorModalOpen: false,
  openWalletSelectorModal: () => {},
  closeWalletSelectorModal: () => {},
  triedEager: false,
  isNetworkModalOpen: false,
  openNetworkModal: () => {},
  closeNetworkModal: () => {},
})

const Web3ConnectionManager = ({
  children,
}: PropsWithChildren<any>): JSX.Element => {
  const addDatadogAction = useRumAction("trackingAppAction")

  const { connector, active } = useWeb3React()
  const {
    isOpen: isWalletSelectorModalOpen,
    onOpen: openWalletSelectorModal,
    onClose: closeWalletSelectorModal,
  } = useDisclosure()
  const {
    isOpen: isNetworkModalOpen,
    onOpen: openNetworkModal,
    onClose: closeNetworkModal,
  } = useDisclosure()
  const router = useRouter()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<AbstractConnector>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  useEffect(() => {
    if (
      triedEager &&
      !active &&
      (router.query.discordId || router.query.redirectUrl)
    )
      openWalletSelectorModal()
  }, [triedEager, active, router.query])

  useEffect(() => {
    if (!active || !triedEager) return
    addDatadogAction("Successfully connected wallet")
  }, [active, triedEager])

  // Sending actions to datadog
  useEffect(() => {
    if (!connector) return
    if (connector === injected) {
      addDatadogAction(`Successfully connected wallet [Metamask]`)
    }
    if (connector === walletConnect)
      addDatadogAction(`Successfully connected wallet [WalletConnect]`)
    if (connector === walletLink)
      addDatadogAction(`Successfully connected wallet [WalletLink]`)
  }, [connector])

  return (
    <Web3Connection.Provider
      value={{
        isWalletSelectorModalOpen,
        openWalletSelectorModal,
        closeWalletSelectorModal,
        triedEager,
        isNetworkModalOpen,
        openNetworkModal,
        closeNetworkModal,
      }}
    >
      {children}
      <WalletSelectorModal
        {...{
          activatingConnector,
          setActivatingConnector,
          isModalOpen: isWalletSelectorModalOpen,
          openModal: openWalletSelectorModal,
          closeModal: closeWalletSelectorModal,
          openNetworkModal,
        }}
      />
      <NetworkModal
        {...{ isOpen: isNetworkModalOpen, onClose: closeNetworkModal }}
      />
    </Web3Connection.Provider>
  )
}
export { Web3Connection, Web3ConnectionManager }
