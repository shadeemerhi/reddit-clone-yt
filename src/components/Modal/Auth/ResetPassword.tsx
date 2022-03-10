import React, { useEffect, useState } from "react";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { BsDot, BsReddit } from "react-icons/bs";
import { ModalView } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import InputItem from "../../Layout/InputItem";

type ResetPasswordProps = {
  toggleView: (view: ModalView) => void;
};

const ResetPassword: React.FC<ResetPasswordProps> = ({ toggleView }) => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [sendAttempt, setSendAttempt] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formError) setFormError("");

    if (!email.includes("@")) {
      return setFormError("Please enter a valid email");
    }
    await sendPasswordResetEmail(email);
    setSendAttempt(true);
    setSendAttempt(false);
  };

  // Workaround to handle successful email send as hook does not gracefully handle the error
  useEffect(() => {
    if (sendAttempt && !error) {
      setSuccess(true);
    }
  }, [error, sendAttempt]);

  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            Enter the email associated with your account and we'll send you a
            reset link
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <InputItem
              name="email"
              placeholder="email"
              type="text"
              mb={2}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Text textAlign="center" fontSize="10pt" color="red">
              {formError || (error && "A user with that email does not exist")}
            </Text>
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text onClick={() => toggleView("login")}>LOGIN</Text>
        <Icon as={BsDot} />
        <Text onClick={() => toggleView("signup")}>SIGN UP</Text>
      </Flex>
    </Flex>
  );
};
export default ResetPassword;
