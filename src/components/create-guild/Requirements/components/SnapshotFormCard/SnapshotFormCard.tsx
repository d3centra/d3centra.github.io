import { FormControl, FormLabel, Icon, Input, Text } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import Link from "components/common/Link"
import StyledSelect from "components/common/StyledSelect"
import { ArrowSquareOut } from "phosphor-react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, Requirement, SelectOption } from "types"
import ChainInfo from "./../ChainInfo"
import useSnapshots from "./hooks/useSnapshots"
import useStrategyParamsArray from "./hooks/useStrategyParamsArray"

type Props = {
  index: number
  field: Requirement
}

const SnapshotFormCard = ({ index, field }: Props): JSX.Element => {
  const [defaultValueObject, setDefaultValueObject] = useState(null)

  useEffect(() => {
    setDefaultValueObject({ ...field?.data?.strategy?.params })
  }, [])

  const {
    control,
    register,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext<GuildFormType>()

  const dataStrategyName = useWatch({
    name: `requirements.${index}.data.strategy.name`,
    control,
  })

  const { strategies, isLoading } = useSnapshots()

  const strategyParams = useStrategyParamsArray(dataStrategyName)

  const capitalize = (text: string) => {
    if (text.length > 1) {
      return text.charAt(0).toUpperCase() + text.slice(1)
    }

    return text
  }

  const mappedStrategies = useMemo(
    () =>
      strategies?.map((strategy) => ({
        label: capitalize(strategy.name),
        value: strategy.name,
      })),
    [strategies]
  )

  useEffect(() => {
    if (!strategyParams) return
    // Delete fields of the previous strategy
    const prevValues = getValues(`requirements.${index}.data.strategy.params`)
    Object.keys(prevValues || {}).forEach((prevParam) => {
      const strategyParamsNames = ["min"].concat(
        strategyParams.map((param) => param.name)
      )
      if (!strategyParamsNames?.includes(prevParam)) {
        setValue(
          `requirements.${index}.data.strategy.params.${prevParam}`,
          undefined
        )
      }
    })

    // Set up default values when picked strategy changes
    strategyParams.forEach((param) => {
      setValue(
        `requirements.${index}.data.strategy.params.${param.name}`,
        dirtyFields?.requirements?.[index]?.data?.strategy?.name
          ? param.defaultValue
          : defaultValueObject?.[param.name]
      )
    })
  }, [strategyParams])

  // We don't display this input rn, just sending a default 0 value to the API
  useEffect(() => {
    setValue(`requirements.${index}.data.strategy.params.min`, 0)
  }, [])

  return (
    <>
      <ChainInfo>Works on ETHEREUM</ChainInfo>

      <FormControl
        position="relative"
        isRequired
        isInvalid={!!errors?.requirements?.[index]?.data?.strategy?.name}
      >
        <FormLabel>Strategy:</FormLabel>
        <Controller
          name={`requirements.${index}.data.strategy.name` as const}
          control={control}
          defaultValue={field.data?.strategy?.name}
          rules={{
            required: "This field is required.",
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <StyledSelect
              ref={ref}
              isClearable
              isLoading={isLoading}
              options={mappedStrategies}
              placeholder="Search..."
              value={mappedStrategies?.find((strategy) => strategy.value === value)}
              defaultValue={mappedStrategies?.find(
                (strategy) => strategy.value === field.data?.strategy?.name
              )}
              onChange={(newValue: SelectOption) => onChange(newValue?.value)}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>
          {errors?.requirements?.[index]?.data?.strategy?.name?.message}
        </FormErrorMessage>
      </FormControl>

      {strategyParams?.map((param) => (
        <FormControl
          key={`${dataStrategyName}-${param.name}`}
          isRequired
          isInvalid={
            errors?.requirements?.[index]?.data?.strategy?.params?.[param.name]
          }
          mb={2}
        >
          <FormLabel>{capitalize(param.name)}</FormLabel>
          <Input
            {...register(
              `requirements.${index}.data.strategy.params.${param.name}` as const,
              {
                required: "This field is required.",
                valueAsNumber: typeof param.defaultValue === "number",
              }
            )}
            defaultValue={field?.data?.strategy?.params?.[param.name]}
          />
          <FormErrorMessage>
            {
              errors?.requirements?.[index]?.data?.strategy?.params?.[param.name]
                ?.message
            }
          </FormErrorMessage>
        </FormControl>
      ))}

      <Link
        href="https://github.com/snapshot-labs/snapshot-strategies/tree/master/src/strategies"
        isExternal
      >
        <Text fontSize="sm">Snapshot strategies</Text>
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </>
  )
}

export default SnapshotFormCard
