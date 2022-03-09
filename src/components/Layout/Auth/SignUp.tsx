import { EmailIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormErrorMessage, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import InputItem from "../InputItem";

type SignUpProps = {
  toggleView: () => void;
};

const SignUp: React.FC<SignUpProps> = ({ toggleView }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [createUserWithEmailAndPassword, user, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (formError) setFormError("");
    event.preventDefault();
    if (!form.email.includes("@")) {
      return setFormError("Please enter a valid email");
    }

    if (form.password !== form.confirmPassword) {
      return setFormError("Passwords do not match");
    }

    createUserWithEmailAndPassword(form.email, form.password);

    // Valid submission
  };

  const onChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <InputItem
        name="email"
        placeholder="email"
        type="text"
        mb={2}
        onChange={onChange}
      />
      <InputItem
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        onChange={onChange}
      />
      <InputItem
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        onChange={onChange}
      />
      <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {formError || authError?.message}
      </Text>
      <Button width="100%" mb={2} mt={2} type="submit" isLoading={loading}>
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Have an account?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={toggleView}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
