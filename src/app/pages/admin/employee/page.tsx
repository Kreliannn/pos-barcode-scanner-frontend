"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { accountInterface, accountInterfaceInput } from "@/app/types/accounts.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { backendUrl } from "@/app/utils/url";
import { errorAlert, successAlert, confirmAlert } from "@/app/utils/alert";

export default function Page() {
  
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [employees, setEmployees] = useState<accountInterface[]>([]);

  const { data } = useQuery({
    queryKey : ["accounts"],
    queryFn : () => axiosInstance.get(backendUrl("/account"))
  })

  useEffect(() => {
    if(data?.data){
      setEmployees(data.data)
    }
  }, [data])

  const mutation = useMutation({
    mutationFn : (data : accountInterfaceInput) => axiosInstance.post("/account", data),
    onSuccess : (response) => {
      setEmployees(response.data)
      setForm({ name: "",  username: "", password: "" });
      successAlert("employee added")
    },
    onError : () => errorAlert("username exist")
  })

  const mutationDelete = useMutation({
    mutationFn : (id : string) => axiosInstance.delete("/account/" + id),
    onSuccess : (response) => {
      setEmployees(response.data)
      successAlert("account deleted")
    },
    onError : () => errorAlert("error accour")
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = (id : string) => {
    confirmAlert("you want to delete this account?", "delete", () => {
      mutationDelete.mutate(id)
    })
  };


  const addEmployee = () => {
    if(!form.name || !form.password || !form.username) return errorAlert("empty field")
    mutation.mutate({
      name : form.name,
      username : form.username,
      password : form.password,
      role : "cashier"
    })
  };

  return (
    <div className="w-full h-dvh p-4 space-y-6">
      <h1 className="text-2xl font-bold">Employees</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        
       
        {/* Add Employee */}
        <Card className="h-[370px]">
          <CardHeader>
            <CardTitle>Add Employee</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Employee Name" />
            </div>

            <div>
              <Label className="mb-2">Username</Label>
              <Input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
            </div>

            <div>
              <Label className="mb-2">Password</Label>
              <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
            </div>

            <Button className="w-full mt-2" onClick={addEmployee}>
              Add Employee
            </Button>
          </CardContent>
        </Card>


        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
          </CardHeader>

          <CardContent>
            {employees.length === 0 ? (
              <p className="text-gray-500">No employees yet...</p>
            ) : (
              <div className="overflow-x-auto max-h-[70vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Username
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((emp) => (
                      <tr key={emp._id}>
                        <td className="px-4 py-2">{emp.name}</td>
                        <td className="px-4 py-2">{emp.username}</td>
                        <td className="px-4 py-2">{emp.role}</td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(emp._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>



      </div>
    </div>
  );
}
