import { useWeb3React } from "@web3-react/core"
import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"
import fetcher from "utils/fetcher"

type Data = { addresses: Array<string> }

const useUpdateUser = () => {
  const { account } = useWeb3React()
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const submit = async (data: Data) =>
    fetcher(`/user/${account}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })

  return useSubmitWithSign<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Address removed!`,
        status: "success",
      })
      mutate(`/user/${account}`)
    },
    onError: (error) => showErrorToast(error),
  })
}

export default useUpdateUser
