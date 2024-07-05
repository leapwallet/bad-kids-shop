import {
    Stack,
    Input,
    Text,
    HStack,
    InputProps,
    FormErrorMessage,
    Box,
    useToast,
} from "@chakra-ui/react";
import { isAddress } from 'viem'; // Ensure this is the correct import
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SnapshotFormValues } from './SnapshotCard';
import { useChain } from '@cosmos-kit/react';

export const InputEthereumAddress: React.FC<
    InputProps & { disabled?: boolean }
> = ({ disabled, ...rest }) => {
    const toast = useToast();
    const { register, setValue, getFieldState } =
        useFormContext<SnapshotFormValues>();
    const isError = !!getFieldState("eth_address").error;

    const [isAutofilled, setIsAutofilled] = useState(false);
    const { username: address } = useChain("stargaze");

    const onAutofillClick = async () => {
        try {
            if (!address) throw new Error("No wallet connected");
            setValue("eth_address", address, {
                shouldValidate: true,
            });
            setIsAutofilled(true); // Set autofilled to true
        } catch (e) {
            setIsAutofilled(false); // Ensure autofill is set to false on error
            const error = e as Error;
            toast({
                title: "Import from Wallet",
                description: <Text color="white">{error.message}</Text>,
                status: "error",
                isClosable: true,
            });
        }
    };

    return (
        <Stack spacing={2}>
            <HStack justifyContent="space-between">
                <Text fontWeight="bold" color="white" fontSize="sm">
                    Ethereum Address
                </Text>
                <HStack
                    as="button"
                    type="button"
                    spacing={1}
                    onClick={onAutofillClick}
                    color="white"
                >
                    <Text fontWeight="bold" fontSize="sm">
                        Import ETH address
                    </Text>
                </HStack>
            </HStack>
            <Box
                boxShadow={isError ? "redOutline1" : "purpleOutline1"}
                borderRadius="16px"
            >
                <Input
                    id="eth_address"
                    placeholder="Ethereum address"
                    fontSize="sm"
                    fontWeight={700}
                    backgroundColor="gray.950"
                    color={isAutofilled ? "black" : "white"} // Conditionally render the color
                    variant="unstyled"
                    borderRadius="16px"
                    px={4}
                    py={6}
                    maxH="64px"
                    type="text"
                    isDisabled={disabled}
                    {...register("eth_address", {
                        required: "Ethereum address is required",
                        validate: (value) =>
                            isAddress(value) ||
                            "This is not a valid Ethereum address",
                    })}
                    autoComplete="off"
                    autoCorrect="off"
                    {...rest}
                />
            </Box>
            {isError && (
                <FormErrorMessage>
                    <HStack spacing="6px">
                        <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color="red.300"
                        >
                            Ethereum address is not valid—make sure it is correct.
                        </Text>
                    </HStack>
                </FormErrorMessage>
            )}
        </Stack>
    );
};
