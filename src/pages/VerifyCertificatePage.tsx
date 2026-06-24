import React, { useState } from 'react';
import { Award, Search } from 'lucide-react';
import { useVerifyCertificate } from '../hooks/useCertificates';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { formatDate } from '../utils/helpers';

export default function VerifyCertificatePage() {
  const params = new URLSearchParams(window.location.search);
  const initialToken = params.get('token') || '';
  const [token, setToken] = useState(initialToken);
  const [submittedToken, setSubmittedToken] = useState(initialToken);

  const { data: certificate, isFetching, error } = useVerifyCertificate(submittedToken);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedToken(token.trim());
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Award className="h-7 w-7 text-primary" />
            <CardTitle>Verify Certificate</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Enter certificate token"
            />
            <Button type="submit" disabled={!token.trim() || isFetching}>
              <Search className="mr-2 h-4 w-4" />
              Verify
            </Button>
          </form>

          {isFetching && <p className="text-sm text-muted-foreground">Checking certificate...</p>}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Certificate could not be verified.
            </div>
          )}

          {certificate && (
            <div className="rounded-md border bg-muted/30 p-4 space-y-2">
              <h2 className="font-semibold">Valid clearance certificate</h2>
              {certificate.student?.name && (
                <p className="text-sm">Student: {certificate.student.name}</p>
              )}
              {certificate.issuedAt && (
                <p className="text-sm">Issued: {formatDate(certificate.issuedAt)}</p>
              )}
              {certificate.fileUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer">
                    Open certificate
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
