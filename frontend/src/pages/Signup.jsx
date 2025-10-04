import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/input/input';
import Button from '../components/button/button';

const Signup = () => {


    return (
        <div className="">
            <Input
                type={"text"}
                label="Full Name"
                name="Full Name"
                placeholder="Jon Doe"
                required
               /*  error_title="Username Error"
                error_message="Username is required" */
            />
            <Input
                type={"email"}
                label="Email"
                name="Email"
                placeholder="jondoe@mail.com"
                required
                /* error_title="Username Error"
                error_message="Username is required" */
            />
            <Input
                type={"password"}
                label="Password"
                name="Password"
                placeholder="●●●●●●●●●"
                required
                error_title="Password Error"
                error_message="Must contain 8 characters"
            />
            <Button
                variant={"primary"}
                children={"Sign Up"}
            />
        </div>
    );
};

export default Signup;